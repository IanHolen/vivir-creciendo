import { NextResponse, type NextRequest } from "next/server";
import { verificarWebhookPayPal } from "@/lib/payments/paypal";
import {
  actualizarSuscripcion,
  buscarSuscripcion,
  conGracia,
  registrarCobroAprobado,
  registrarEvento,
} from "@/lib/payments/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Avisos de PayPal (Subscriptions). Orden de cada aviso:
 *   1. firma válida (postback a PayPal) → si no, 400 y nada más;
 *   2. ¿ya lo procesamos? (PayPal reintenta hasta 25 veces) → 200 y fuera;
 *   3. releer lo mínimo del recurso y actualizar la base;
 *   4. recalcular el acceso (lo hace actualizarSuscripcion / registrarCobro).
 */
interface PayPalEvent {
  id: string;
  event_type: string;
  create_time?: string;
  resource?: {
    id?: string;
    status?: string;
    billing_agreement_id?: string;
    billing_info?: { next_billing_time?: string };
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

  const valido = await verificarWebhookPayPal(req.headers, event).catch(() => false);
  if (!valido) return NextResponse.json({ error: "firma inválida" }, { status: 400 });

  const nuevo = await registrarEvento("paypal", event.id, event.event_type, event);
  if (!nuevo) return NextResponse.json({ ok: true, duplicado: true });

  const r = event.resource ?? {};
  switch (event.event_type) {
    case "BILLING.SUBSCRIPTION.ACTIVATED":
    case "BILLING.SUBSCRIPTION.RE-ACTIVATED":
    case "BILLING.SUBSCRIPTION.UPDATED":
    case "BILLING.SUBSCRIPTION.SUSPENDED":
    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.EXPIRED":
    case "BILLING.SUBSCRIPTION.CREATED": {
      if (!r.id) break;
      const sub = await buscarSuscripcion("paypal", r.id);
      if (!sub) break;
      const next = r.billing_info?.next_billing_time ?? null;
      const cambios: Parameters<typeof actualizarSuscripcion>[2] = { raw: r };
      if (r.status) cambios.status = r.status;
      if (next) {
        cambios.next_billing_at = next;
        // Activa con próximo cobro conocido = ya está cubierta hasta esa
        // fecha, aunque el aviso del cobro llegue después o nunca.
        if (r.status === "ACTIVE") {
          const hasta = conGracia(new Date(next));
          const actual = sub.paid_until ? new Date(sub.paid_until) : null;
          if (!actual || hasta > actual) cambios.paid_until = hasta.toISOString();
        }
      }
      await actualizarSuscripcion("paypal", r.id, cambios);
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
    case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
    case "PAYMENT.SALE.REFUNDED":
    case "PAYMENT.SALE.REVERSED":
      // Quedan registrados en webhook_events. No se quita el acceso por un
      // cobro fallido: PayPal reintenta y, si agota, manda SUSPENDED.
      break;
    default:
      break;
  }

  return NextResponse.json({ ok: true });
}
