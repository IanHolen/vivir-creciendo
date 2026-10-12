import { NextResponse, type NextRequest } from "next/server";
import {
  obtenerCobroMP,
  obtenerSuscripcionMP,
  verificarWebhookMP,
} from "@/lib/payments/mercadopago";
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

  // La firma se calcula SOLO con el data.id de la query string (así lo
  // define MP); el del cuerpo sirve para procesar si la query no lo trae.
  const dataIdQuery = url.searchParams.get("data.id");
  const dataId = dataIdQuery ?? (body.data?.id != null ? String(body.data.id) : null);
  const type = url.searchParams.get("type") ?? body.type ?? null;

  const valido = verificarWebhookMP({
    xSignature: req.headers.get("x-signature"),
    xRequestId: req.headers.get("x-request-id"),
    dataId: dataIdQuery,
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
        const next = sub.next_payment_date ?? null;
        await actualizarSuscripcion("mercadopago", sub.id, {
          status: sub.status,
          next_billing_at: next,
          ...(sub.status === "authorized" && next ? { paidUntil: conGracia(new Date(next)) } : {}),
          raw: sub,
        });
      }
    } else if (type === "subscription_authorized_payment") {
      const cobro = await obtenerCobroMP(dataId);
      const ps = cobro.payment?.status;
      if ((ps === "refunded" || ps === "charged_back") && cobro.payment?.id) {
        await marcarCobroRevertido("mercadopago", String(cobro.payment.id), ps);
      } else if (ps === "approved" && cobro.preapproval_id) {
        await registrarCobroAprobado({
          provider: "mercadopago",
          providerSubId: cobro.preapproval_id,
          providerPaymentId: String(cobro.payment?.id ?? cobro.id),
          amount: cobro.transaction_amount ?? null,
          currency: cobro.currency_id ?? null,
          paidAt: new Date(cobro.debit_date ?? Date.now()),
          raw: cobro,
        });
      }
    }
  } catch (e) {
    // Fallo nuestro (base caída, timeout): se olvida el evento y se responde
    // 500 para que MP lo reintente (cada 15 min). Si fuera un 200, el pago o
    // la cancelación se perderían para siempre.
    console.error("[webhook mercadopago]", type, e);
    await olvidarEvento("mercadopago", eventId).catch(() => {});
    return NextResponse.json({ error: "reintentar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
