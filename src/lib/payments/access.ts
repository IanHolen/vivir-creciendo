import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanKey, Provider } from "@/lib/payments/plans";
import { PLANES } from "@/lib/payments/plans";

/**
 * Lo que comparten los dos proveedores una vez que el evento ya está
 * traducido: guardar la suscripción, guardar el cobro y recalcular el acceso.
 *
 * El acceso lo decide `sync_membership_from_subscriptions()` en la base: una
 * suscripción activa o un `paid_until` en el futuro ponen
 * profiles.membership_id = 4; si no, lo quitan. Acá solo se alimentan esas
 * dos cosas.
 */

/** Días de gracia después del período pagado, para que un reintento de cobro
 *  del proveedor no deje a la socia afuera un fin de semana. */
const GRACIA_DIAS = 3;

/** Una fecha de fin de período + los días de gracia. */
export function conGracia(finDePeriodo: Date): Date {
  const d = new Date(finDePeriodo);
  d.setUTCDate(d.getUTCDate() + GRACIA_DIAS);
  return d;
}

/** Hasta cuándo cubre un cobro hecho en `pagadoEn` para `plan`. */
export function paidUntilDesde(pagadoEn: Date, plan: PlanKey): Date {
  const d = new Date(pagadoEn);
  d.setUTCMonth(d.getUTCMonth() + PLANES[plan].meses);
  return conGracia(d);
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  provider: Provider;
  provider_sub_id: string;
  plan: PlanKey;
  status: string;
  currency: string;
  amount: number;
  paid_until: string | null;
  next_billing_at: string | null;
  cancel_requested_at: string | null;
}

export async function buscarSuscripcion(provider: Provider, providerSubId: string) {
  const db = createAdminClient();
  const { data } = await db
    .from("subscriptions")
    .select("*")
    .eq("provider", provider)
    .eq("provider_sub_id", providerSubId)
    .maybeSingle();
  return (data as SubscriptionRow | null) ?? null;
}

/** Actualiza estado/fechas y recalcula el acceso del usuario. */
export async function actualizarSuscripcion(
  provider: Provider,
  providerSubId: string,
  cambios: Partial<Pick<SubscriptionRow, "status" | "next_billing_at" | "paid_until">> & {
    raw?: unknown;
  }
): Promise<SubscriptionRow | null> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("subscriptions")
    .update(cambios)
    .eq("provider", provider)
    .eq("provider_sub_id", providerSubId)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  const row = data as SubscriptionRow | null;
  if (row) await sincronizarAcceso(row.user_id);
  return row;
}

/**
 * Registra un cobro aprobado (idempotente por provider+payment id) y extiende
 * `paid_until`. Si el cobro ya estaba, no hace nada.
 */
export async function registrarCobroAprobado(input: {
  provider: Provider;
  providerSubId: string;
  providerPaymentId: string;
  amount: number | null;
  currency: string | null;
  paidAt: Date;
  raw?: unknown;
}): Promise<void> {
  const sub = await buscarSuscripcion(input.provider, input.providerSubId);
  if (!sub) return;

  const db = createAdminClient();
  const { error } = await db.from("subscription_payments").insert({
    subscription_id: sub.id,
    provider: input.provider,
    provider_payment_id: input.providerPaymentId,
    status: "approved",
    amount: input.amount,
    currency: input.currency,
    paid_at: input.paidAt.toISOString(),
    raw: input.raw ?? null,
  });
  // 23505 = ya estaba: el proveedor reintentó el aviso. Nada que hacer.
  if (error && error.code !== "23505") throw error;
  if (error) return;

  const nuevo = paidUntilDesde(input.paidAt, sub.plan);
  const actual = sub.paid_until ? new Date(sub.paid_until) : null;
  await actualizarSuscripcion(input.provider, input.providerSubId, {
    paid_until: (!actual || nuevo > actual ? nuevo : actual).toISOString(),
  });
}

export async function sincronizarAcceso(userId: string): Promise<boolean> {
  const db = createAdminClient();
  const { data, error } = await db.rpc("sync_membership_from_subscriptions", {
    p_user_id: userId,
  });
  if (error) throw error;
  return Boolean(data);
}

/** Guarda el aviso; devuelve false si ya lo habíamos procesado. */
export async function registrarEvento(
  provider: Provider,
  eventId: string,
  type: string | null,
  payload: unknown
): Promise<boolean> {
  const db = createAdminClient();
  const { error } = await db
    .from("webhook_events")
    .insert({ provider, event_id: eventId, type, payload });
  if (error && error.code === "23505") return false;
  if (error) throw error;
  return true;
}
