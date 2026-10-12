import "server-only";

/**
 * Capa mínima sobre la REST API de PayPal (Subscriptions v1 + Webhooks v1).
 *
 * Sin SDK a propósito: el SDK oficial de Node no cubre la verificación de
 * firma de webhooks ni el catálogo de productos, y con `fetch` son ~80 líneas
 * que se leen enteras.
 *
 * Sandbox o producción lo decide PAYPAL_ENV. Los IDs de plan y de webhook son
 * DISTINTOS por entorno: no mezclar.
 */

const BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/** Solo se vende si TODO está: sin PAYPAL_WEBHOOK_ID, una cancelación hecha
 *  en paypal.com nunca se reflejaría y la socia tendría acceso indefinido. */
export const paypalConfigurado = Boolean(
  process.env.PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET &&
    process.env.PAYPAL_PLAN_MENSUAL &&
    process.env.PAYPAL_PLAN_ANUAL &&
    process.env.PAYPAL_WEBHOOK_ID
);

if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production" && process.env.PAYPAL_ENV !== "live") {
  console.error("[paypal] ATENCIÓN: el sitio está en producción pero PAYPAL_ENV no es 'live'. Los pagos irían a sandbox.");
}

let cached: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.exp - 60_000) return cached.token;
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal token ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, exp: Date.now() + data.expires_in * 1000 };
  return cached.token;
}

export async function paypal<T>(
  path: string,
  init: { method?: string; body?: unknown; requestId?: string } = {}
): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.requestId ? { "PayPal-Request-Id": init.requestId } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  if (res.status === 204) return undefined as T;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `PayPal ${init.method ?? "GET"} ${path} -> ${res.status} ${JSON.stringify(json)}`
    );
  }
  return json as T;
}

export type PayPalSubscriptionStatus =
  | "APPROVAL_PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "CANCELLED"
  | "EXPIRED";

export interface PayPalSubscription {
  id: string;
  plan_id: string;
  status: PayPalSubscriptionStatus;
  custom_id?: string;
  start_time?: string;
  billing_info?: {
    next_billing_time?: string;
    last_payment?: { amount?: { value: string; currency_code: string }; time?: string };
    failed_payments_count?: number;
  };
  links?: { rel: string; href: string }[];
}

/** PayPal pide nombre y apellido por separado. */
function nombrePayPal(completo: string): { given_name: string; surname?: string } {
  const partes = completo.trim().split(/\s+/);
  if (partes.length < 2) return { given_name: partes[0] ?? "" };
  return { given_name: partes.slice(0, -1).join(" "), surname: partes[partes.length - 1] };
}

export function planIdDe(plan: "mensual" | "anual"): string {
  const id = plan === "mensual" ? process.env.PAYPAL_PLAN_MENSUAL : process.env.PAYPAL_PLAN_ANUAL;
  if (!id) throw new Error(`Falta PAYPAL_PLAN_${plan.toUpperCase()} en el entorno.`);
  return id;
}

export async function crearSuscripcionPayPal(input: {
  plan: "mensual" | "anual";
  userId: string;
  email: string | null;
  nombre: string | null;
  returnUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; status: PayPalSubscriptionStatus; approveUrl: string }> {
  const sub = await paypal<PayPalSubscription>("/v1/billing/subscriptions", {
    method: "POST",
    requestId: `vc-${input.userId}-${input.plan}-${Date.now()}`,
    body: {
      plan_id: planIdDe(input.plan),
      custom_id: input.userId,
      subscriber: {
        ...(input.email ? { email_address: input.email } : {}),
        ...(input.nombre ? { name: nombrePayPal(input.nombre) } : {}),
      },
      application_context: {
        brand_name: "Vivir Creciendo",
        locale: "es-ES",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
      },
    },
  });
  const approveUrl = sub.links?.find((l) => l.rel === "approve")?.href;
  if (!approveUrl) throw new Error("PayPal no devolvió el link de aprobación.");
  return { id: sub.id, status: sub.status, approveUrl };
}

export function obtenerSuscripcionPayPal(id: string) {
  return paypal<PayPalSubscription>(`/v1/billing/subscriptions/${encodeURIComponent(id)}`);
}

export function cancelarSuscripcionPayPal(id: string, reason: string) {
  return paypal<void>(`/v1/billing/subscriptions/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
    body: { reason },
  });
}

/**
 * Verificación de firma por "postback": se le manda a PayPal lo que llegó y
 * PayPal responde si lo firmó. Más simple y más seguro que recalcular el
 * CRC32 y bajar el certificado a mano.
 */
export async function verificarWebhookPayPal(
  headers: Headers,
  event: unknown
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;
  const r = await paypal<{ verification_status: "SUCCESS" | "FAILURE" }>(
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: {
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: event,
      },
    }
  );
  return r.verification_status === "SUCCESS";
}
