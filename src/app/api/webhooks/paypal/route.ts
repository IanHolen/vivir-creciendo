import { NextResponse, type NextRequest } from "next/server";
import { obtenerSuscripcionPayPal, verificarWebhookPayPal } from "@/lib/payments/paypal";
import {
  actualizarSuscripcion,
  buscarSuscripcion,
  conGracia,
  marcarCobroRevertido,
  olvidarEvento,
  registrarCobroAprobado,
  registrarEvento,
} from "@/lib/payments/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Avisos de PayPal (Subscriptions). Orden de cada aviso:
 *   1. firma válida (postback a PayPal) → si no, 400 y nada más;
 *   2. ¿ya lo procesamos? (PayPal reintenta hasta 25 veces) → 200 y fuera;
 *   3. para avisos de suscripción, RELEER el estado real con GET: PayPal no
 *      garantiza el orden de entrega, y la foto que trae el evento puede ser
 *      anterior a una cancelación;
 *   4. si algo nuestro falla, se borra el registro del evento y se responde
 *      500 para que PayPal reintente.
 */
interface PayPalEvent {
  id: string;
  event_type: string;
  create_time?: string;
  resource?: {
    id?: string;
    status?: string;
    billing_agreement_id?: string;
    sale_id?: string;
    amount?: { total?: string; currency?: string };
    create_time?: string;
  };
}

export async function POST(req: NextRequest) {
  let event: PayPalEvent;
  try {
    event = (await req.json()) as PayPalEvent;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!event?.id || !event.event_type) {
    return NextResponse.json({ error: "evento incompleto" }, { status: 400 });
  }

  const valido = await verificarWebhookPayPal(req.headers, event).catch(() => false);
  if (!valido) return NextResponse.json({ error: "firma inválida" }, { status: 400 });

  const nuevo = await registrarEvento("paypal", event.id, event.event_type, event);
  if (!nuevo) return NextResponse.json({ ok: true, duplicado: true });

  const r = event.resource ?? {};
  try {
    switch (event.event_type) {
      case "BILLING.SUBSCRIPTION.CREATED":
      case "BILLING.SUBSCRIPTION.ACTIVATED":
      case "BILLING.SUBSCRIPTION.RE-ACTIVATED":
      case "BILLING.SUBSCRIPTION.UPDATED":
      case "BILLING.SUBSCRIPTION.SUSPENDED":
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED": {
        if (!r.id) break;
        const sub = await buscarSuscripcion("paypal", r.id);
        if (!sub) break; // no es nuestra (o se creó fuera del sitio)
        const s = await obtenerSuscripcionPayPal(r.id);
        const next = s.billing_info?.next_billing_time ?? null;
        await actualizarSuscripcion("paypal", r.id, {
          status: s.status,
          next_billing_at: next,
          // Activa con próximo cobro conocido = cubierta hasta esa fecha,
          // aunque el aviso del cobro llegue después o nunca.
          ...(s.status === "ACTIVE" && next ? { paidUntil: conGracia(new Date(next)) } : {}),
          raw: s,
        });
        break;
      }
      case "PAYMENT.SALE.COMPLETED": {
        const subId = r.billing_agreement_id;
        if (!subId || !r.id) break;
        await registrarCobroAprobado({
          provider: "paypal",
          providerSubId: subId,
          providerPaymentId: r.id,
          amount: r.amount?.total ? Number(r.amount.total) : null,
          currency: r.amount?.currency ?? null,
          paidAt: new Date(r.create_time ?? event.create_time ?? Date.now()),
          raw: r,
        });
        break;
      }
      case "PAYMENT.SALE.REFUNDED":
      case "PAYMENT.SALE.REVERSED": {
        // En el refund, `resource` es el reembolso y `sale_id` apunta al
        // cobro original; en la reversión, `resource.id` es el cobro.
        const saleId = r.sale_id ?? r.id;
        if (!saleId) break;
        await marcarCobroRevertido(
          "paypal",
          saleId,
          event.event_type === "PAYMENT.SALE.REFUNDED" ? "refunded" : "reversed"
        );
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("[webhook paypal]", event.event_type, e);
    await olvidarEvento("paypal", event.id).catch(() => {});
    return NextResponse.json({ error: "reintentar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
