import "server-only";
import {
  MercadoPagoConfig,
  PreApproval,
  Invoice,
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from "mercadopago";
import type { PlanKey } from "./plans";
import { obtenerPreciosArs, preciosCompletos } from "./precios-ars";

/**
 * Suscripciones de Mercado Pago Argentina (API de "preapproval").
 *
 * Decisiones:
 *  · SIN plan asociado: se crea un preapproval por socia con el monto del
 *    momento y `external_reference = user.id`. Es más simple de reconciliar
 *    que mantener planes del lado de MP.
 *  · Flujo "pago pendiente": `status: "pending"` sin tarjeta; MP devuelve un
 *    `init_point` (checkout hospedado) y la socia paga ahí. Nunca pedimos la
 *    tarjeta en nuestro sitio.
 *  · Moneda ARS: MP Argentina no cobra en USD. El monto lo definen las
 *    fundadoras desde /admin/suscripciones (tabla site_settings), con las
 *    variables MP_PRECIO_*_ARS como respaldo.
 */

/** Credenciales presentes. Solo se vende si TODO está, incluida la clave de
 *  webhooks: sin ella una cancelación hecha en la app de MP nunca se reflejaría.
 *  Los precios en ARS se leen aparte (`obtenerPreciosArs`, los edita el admin). */
export const mercadoPagoCredenciales = Boolean(process.env.MP_ACCESS_TOKEN && process.env.MP_WEBHOOK_SECRET);

/** Listo para vender: credenciales + los dos precios cargados. */
export async function mercadoPagoListo(): Promise<boolean> {
  if (!mercadoPagoCredenciales) return false;
  return preciosCompletos(await obtenerPreciosArs());
}

function cliente() {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Falta MP_ACCESS_TOKEN en el entorno.");
  return new MercadoPagoConfig({ accessToken, options: { timeout: 8000 } });
}

export async function montoArs(plan: PlanKey): Promise<number> {
  const precios = await obtenerPreciosArs();
  const n = precios[plan];
  if (n == null) throw new Error(`Falta el precio en ARS del plan ${plan} (se carga en /admin/suscripciones).`);
  return n;
}

export type MPStatus = "pending" | "authorized" | "paused" | "cancelled";

export interface MPPreapproval {
  id: string;
  status: MPStatus;
  external_reference?: string;
  payer_email?: string;
  payer_id?: number;
  init_point?: string;
  next_payment_date?: string;
  auto_recurring?: { transaction_amount?: number; currency_id?: string; frequency?: number; frequency_type?: string };
  summarized?: { last_charged_date?: string; last_charged_amount?: number };
}

export async function crearSuscripcionMP(input: {
  plan: "mensual" | "anual";
  userId: string;
  email: string;
  backUrl: string;
}): Promise<{ id: string; status: MPStatus; initPoint: string; monto: number }> {
  const monto = await montoArs(input.plan);
  const pre = new PreApproval(cliente());
  const res = (await pre.create({
    body: {
      reason: `Membresía Vivir Creciendo (${input.plan})`,
      external_reference: input.userId,
      payer_email: input.email,
      back_url: input.backUrl,
      status: "pending",
      auto_recurring: {
        frequency: input.plan === "mensual" ? 1 : 12,
        frequency_type: "months",
        transaction_amount: monto,
        currency_id: "ARS",
      },
    },
  })) as unknown as MPPreapproval;

  if (!res.id || !res.init_point) throw new Error("Mercado Pago no devolvió init_point.");

  // Desde el 2-sep-2026 el init_point llega con `&activation=true` y esa
  // página responde "no existe" (issue #480 de sdk-nodejs). Sin el parámetro
  // el checkout abre bien. Si MP lo corrige, esta línea es inofensiva.
  const url = new URL(res.init_point);
  url.searchParams.delete("activation");

  return { id: res.id, status: res.status, initPoint: url.toString(), monto };
}

export async function obtenerSuscripcionMP(id: string): Promise<MPPreapproval> {
  return (await new PreApproval(cliente()).get({ id })) as unknown as MPPreapproval;
}

export async function cancelarSuscripcionMP(id: string): Promise<void> {
  await new PreApproval(cliente()).update({ id, body: { status: "cancelled" } });
}

export interface MPAuthorizedPayment {
  id: string | number;
  preapproval_id: string;
  status: "scheduled" | "processed" | "recycling" | string;
  payment?: { id?: number; status?: string; status_detail?: string };
  transaction_amount?: number;
  currency_id?: string;
  debit_date?: string;
  external_reference?: string;
}

export async function obtenerCobroMP(id: string): Promise<MPAuthorizedPayment> {
  return (await new Invoice(cliente()).get({ id })) as unknown as MPAuthorizedPayment;
}

/** true si la firma es válida; false si no (nunca lanza). */
export function verificarWebhookMP(input: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return false;
  try {
    WebhookSignatureValidator.validate({
      xSignature: input.xSignature,
      xRequestId: input.xRequestId,
      dataId: input.dataId,
      secret,
      toleranceSeconds: 600,
    });
    return true;
  } catch (e) {
    if (e instanceof InvalidWebhookSignatureError) return false;
    throw e;
  }
}
