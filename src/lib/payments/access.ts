import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanKey, Provider } from "@/lib/payments/plans";
import { PLANES } from "@/lib/payments/plans";
import { cancelarSuscripcionPayPal, obtenerSuscripcionPayPal } from "@/lib/payments/paypal";
import { cancelarSuscripcionMP, obtenerSuscripcionMP } from "@/lib/payments/mercadopago";

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
  /** 'duplicada' = la cerró cerrarDuplicadas(); sus cobros no dan acceso. */
  cancel_reason?: string | null;
  created_at?: string;
}

/** Estados con cobro en marcha. */
const ACTIVOS = ["ACTIVE", "authorized"];
/** Todo lo que no es terminal: puede llegar a cobrar. */
const VIVOS = [...ACTIVOS, "APPROVAL_PENDING", "APPROVED", "pending", "SUSPENDED", "paused"];
const TERMINALES = ["CANCELLED", "cancelled", "EXPIRED"];

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

/**
 * Actualiza estado/fechas y recalcula el acceso del usuario.
 *
 * `paid_until` NO se escribe directo: pasa por `extend_paid_until()` en la
 * base, que solo lo deja crecer (greatest). Así ni un reintento de cobro
 * con `next_billing_time` más cercano, ni un aviso viejo, ni dos avisos a
 * la vez pueden acortar el acceso ya pagado. Los estados terminales
 * (cancelada/vencida) los protege el trigger `subscriptions_guard_terminal`.
 */
export async function actualizarSuscripcion(
  provider: Provider,
  providerSubId: string,
  cambios: Partial<Pick<SubscriptionRow, "status" | "next_billing_at" | "cancel_requested_at">> & {
    raw?: unknown;
    /** Fin de período conocido: extiende paid_until si es mayor al actual. */
    paidUntil?: Date;
  }
): Promise<SubscriptionRow | null> {
  const db = createAdminClient();
  const { paidUntil, ...campos } = cambios;
  const { data, error } = await db
    .from("subscriptions")
    .update(campos)
    .eq("provider", provider)
    .eq("provider_sub_id", providerSubId)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  const row = data as SubscriptionRow | null;
  if (!row) return null;
  if (paidUntil && row.cancel_reason !== "duplicada") {
    const { error: e2 } = await db.rpc("extend_paid_until", {
      p_provider: provider,
      p_sub_id: providerSubId,
      p_until: paidUntil.toISOString(),
    });
    if (e2) throw e2;
  }
  if (ACTIVOS.includes(row.status)) await cerrarDuplicadas(row.user_id);
  await sincronizarAcceso(row.user_id);
  return row;
}

/**
 * Una sola suscripción cobrando por persona.
 *
 * `iniciarSuscripcion` ya no deja empezar otra si hay una activa, pero con dos
 * pestañas abiertas se pueden aprobar dos pagos antes de que llegue ningún
 * aviso. Esto corre cada vez que una suscripción queda activa (webhooks y
 * página de retorno, todo pasa por actualizarSuscripcion):
 *
 *  · GANADORA = la activa MÁS ANTIGUA. Es determinista a propósito: si los
 *    avisos de las dos llegan a la vez, los dos procesos eligen la misma y
 *    no se cancelan mutuamente.
 *  · Las demás vivas se cancelan en el proveedor y se marcan
 *    cancel_reason = 'duplicada'; sus cobros pasan a 'duplicado' (no cuentan
 *    para paid_until) y se avisa en /admin/suscripciones para reembolsarlos.
 *    No se reembolsa solo: mover dinero lo decide una persona.
 *  · Una pendiente que el proveedor no deja cancelar (PayPal sin aprobar) se
 *    deja como está y SIN marcar: si se marcara cancelada, la guardia de "no
 *    revivir canceladas" taparía su activación y quedaría cobrando sin que
 *    nos enteremos. Si alguien la aprueba después, su propia activación pasa
 *    por acá y la cierra.
 *
 * Idempotente: una ya cerrada no vuelve a entrar (no está en VIVOS) y
 * cancelar algo que el proveedor ya canceló se trata como éxito.
 */
export async function cerrarDuplicadas(userId: string): Promise<void> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", VIVOS)
    .order("created_at", { ascending: true });
  if (error) throw error;
  const vivas = (data ?? []) as SubscriptionRow[];
  const ganadora = vivas.find((s) => ACTIVOS.includes(s.status));
  if (!ganadora) return;

  for (const dup of vivas) {
    if (dup.id === ganadora.id) continue;
    if (!(await cancelarEnProveedor(dup))) continue; // pendiente sin aprobar: ver arriba

    const { error: e1 } = await db
      .from("subscriptions")
      .update({
        status: dup.provider === "paypal" ? "CANCELLED" : "cancelled",
        cancel_reason: "duplicada",
        // Sus cobros no cuentan: el acceso lo da la ganadora.
        paid_until: new Date().toISOString(),
      })
      .eq("id", dup.id);
    if (e1) throw e1;

    const { data: cobros, error: e2 } = await db
      .from("subscription_payments")
      .update({ status: "duplicado" })
      .eq("subscription_id", dup.id)
      .eq("status", "approved")
      // Solo lo cobrado desde que existe la ganadora. Si la "otra" era una
      // vieja suspendida y la persona se volvió a suscribir, sus cobros
      // anteriores fueron legítimos y no se reembolsan.
      .gte("paid_at", ganadora.created_at ?? new Date(0).toISOString())
      .select("provider_payment_id, amount, currency");
    if (e2) throw e2;

    console.error(
      "[suscripcion] duplicada cerrada:",
      JSON.stringify({ userId, ganadora: ganadora.provider_sub_id, cerrada: dup.provider_sub_id, cobrosAReembolsar: cobros ?? [] })
    );
  }
}

/**
 * Cancela en el proveedor. true si quedó cancelada (ahora o de antes); false
 * si el proveedor no la deja cancelar porque todavía nadie la aprobó. Lanza
 * en cualquier otro error, para que el webhook responda 500 y se reintente.
 */
async function cancelarEnProveedor(sub: SubscriptionRow): Promise<boolean> {
  try {
    if (sub.provider === "paypal") {
      await cancelarSuscripcionPayPal(sub.provider_sub_id, "Suscripción duplicada: ya tiene otra membresía activa");
    } else {
      await cancelarSuscripcionMP(sub.provider_sub_id);
    }
    return true;
  } catch (e) {
    const actual =
      sub.provider === "paypal"
        ? (await obtenerSuscripcionPayPal(sub.provider_sub_id)).status
        : (await obtenerSuscripcionMP(sub.provider_sub_id)).status;
    if (TERMINALES.includes(actual)) return true;
    if (actual === "APPROVAL_PENDING" || actual === "pending") return false;
    throw e;
  }
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
  // Cobro de una suscripción que cerramos por duplicada (llegó después de
  // cancelarla): se guarda para reembolsar, pero no da acceso.
  const duplicado = sub.cancel_reason === "duplicada";

  const db = createAdminClient();
  const { error } = await db.from("subscription_payments").insert({
    subscription_id: sub.id,
    provider: input.provider,
    provider_payment_id: input.providerPaymentId,
    status: duplicado ? "duplicado" : "approved",
    amount: input.amount,
    currency: input.currency,
    paid_at: input.paidAt.toISOString(),
    raw: input.raw ?? null,
  });
  // 23505 = ya estaba: el proveedor reintentó el aviso. Nada que hacer.
  if (error && error.code !== "23505") throw error;
  if (error) return;
  if (duplicado) {
    console.error(
      "[suscripcion] cobro en suscripción duplicada (reembolsar):",
      JSON.stringify({ sub: sub.provider_sub_id, pago: input.providerPaymentId, monto: input.amount, moneda: input.currency })
    );
    return;
  }

  await actualizarSuscripcion(input.provider, input.providerSubId, {
    paidUntil: paidUntilDesde(input.paidAt, sub.plan),
  });
}

/**
 * Un cobro devuelto o revertido. Se marca el pago y se recalcula paid_until
 * a partir de los cobros que SIGUEN aprobados (si no queda ninguno, ahora
 * mismo). Es la única operación que puede acortar paid_until, y lo hace a
 * propósito: una socia reembolsada del plan anual no conserva 12 meses.
 */
export async function marcarCobroRevertido(
  provider: Provider,
  providerPaymentId: string,
  estado: "refunded" | "reversed" | "charged_back"
): Promise<void> {
  const db = createAdminClient();
  const { data: pago } = await db
    .from("subscription_payments")
    .update({ status: estado })
    .eq("provider", provider)
    .eq("provider_payment_id", providerPaymentId)
    .select("subscription_id")
    .maybeSingle();
  if (!pago) return;

  const { data: sub } = await db
    .from("subscriptions")
    .select("*")
    .eq("id", pago.subscription_id)
    .maybeSingle();
  if (!sub) return;
  const fila = sub as SubscriptionRow;

  const { data: aprobados } = await db
    .from("subscription_payments")
    .select("paid_at")
    .eq("subscription_id", fila.id)
    .eq("status", "approved");
  const fechas = (aprobados ?? [])
    .map((p) => (p.paid_at ? paidUntilDesde(new Date(p.paid_at), fila.plan).getTime() : 0))
    .filter(Boolean);
  const nuevo = fechas.length ? new Date(Math.max(...fechas)) : new Date();

  const { error } = await db
    .from("subscriptions")
    .update({ paid_until: nuevo.toISOString() })
    .eq("id", fila.id);
  if (error) throw error;
  await sincronizarAcceso(fila.user_id);
}

export async function sincronizarAcceso(userId: string): Promise<boolean> {
  const db = createAdminClient();
  const { data, error } = await db.rpc("sync_membership_from_subscriptions", {
    p_user_id: userId,
  });
  if (error) throw error;
  return Boolean(data);
}

/**
 * Guarda el aviso; devuelve false si ya lo habíamos procesado.
 *
 * Se registra ANTES de procesar para cortar reintentos simultáneos, y si el
 * procesamiento falla se llama a `olvidarEvento()` y se responde 5xx, para
 * que el proveedor lo vuelva a mandar. Sin eso, un fallo transitorio de la
 * base dejaría un pago (o una cancelación) perdido para siempre.
 */
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

export async function olvidarEvento(provider: Provider, eventId: string): Promise<void> {
  const db = createAdminClient();
  await db.from("webhook_events").delete().eq("provider", provider).eq("event_id", eventId);
}
