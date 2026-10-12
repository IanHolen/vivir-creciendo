import { NextResponse, type NextRequest } from "next/server";
import {
  obtenerCobroMP,
  obtenerSuscripcionMP,
  verificarWebhookMP,
} from "@/lib/payments/mercadopago";
import {
  actualizarSuscripcion,
  buscarSuscripcion,
  registrarCobroAprobado,
  registrarEvento,
} from "@/lib/payments/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Avisos de Mercado Pago (suscripciones). MP exige respuesta 200/201 en menos
 * de 22 s y reintenta cada 15 min; el aviso trae solo un id, así que el
 * estado real se lee con un GET al recurso.
 */
interface MPNotification {
  id?: number | string;
  type?: string;
  action?: string;
  data?: { id?: string | number };
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  let body: MPNotification = {};
  try {
    body = (await req.json()) as MPNotification;
  } catch {
    // MP a veces manda cuerpo vacío en pruebas del simulador; los datos van
    // también en la query string.
  }

  const dataId = url.searchParams.get("data.id") ?? (body.data?.id != null ? String(body.data.id) : null);
  const type = url.searchParams.get("type") ?? body.type ?? null;

  const valido = verificarWebhookMP({
    xSignature: req.headers.get("x-signature"),
    xRequestId: req.headers.get("x-request-id"),
    dataId,
  });
  if (!valido) return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  if (!dataId || !type) return NextResponse.json({ ok: true, ignorado: true });

  const eventId = body.id != null ? String(body.id) : (req.headers.get("x-request-id") ?? `${type}:${dataId}:${Date.now()}`);
  const nuevo = await registrarEvento("mercadopago", eventId, `${type}${body.action ? ":" + body.action : ""}`, {
    body,
    query: Object.fromEntries(url.searchParams),
  });
  if (!nuevo) return NextResponse.json({ ok: true, duplicado: true });

  try {
    if (type === "subscription_preapproval") {
      const sub = await obtenerSuscripcionMP(dataId);
      const existente = await buscarSuscripcion("mercadopago", sub.id);
      if (existente) {
        await actualizarSuscripcion("mercadopago", sub.id, {
          status: sub.status,
          next_billing_at: sub.next_payment_date ?? null,
          raw: sub,
        });
      }
    } else if (type === "subscription_authorized_payment") {
      const cobro = await obtenerCobroMP(dataId);
      if (cobro.payment?.status === "approved" && cobro.preapproval_id) {
        await registrarCobroAprobado({
          provider: "mercadopago",
          providerSubId: cobro.preapproval_id,
          providerPaymentId: String(cobro.payment.id ?? cobro.id),
          amount: cobro.transaction_amount ?? null,
          currency: cobro.currency_id ?? null,
          paidAt: new Date(cobro.debit_date ?? Date.now()),
          raw: cobro,
        });
      }
    }
  } catch (e) {
    // Se responde 200 igual: ya quedó el evento guardado y MP no tiene por
    // qué reintentar un aviso que nosotros no supimos procesar. El error
    // queda en los logs para revisarlo.
    console.error("[webhook mercadopago]", e);
  }

  return NextResponse.json({ ok: true });
}
