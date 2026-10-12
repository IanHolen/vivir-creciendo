#!/usr/bin/env node
/**
 * Crea (una sola vez por entorno) el Product y los dos Plans de la membresía
 * en PayPal, y opcionalmente el webhook. Idempotente: si ya existen, los
 * reutiliza. Imprime las variables de entorno a pegar.
 *
 *   node scripts/paypal-setup.mjs                      # sandbox, sin webhook
 *   node scripts/paypal-setup.mjs --live               # producción
 *   node scripts/paypal-setup.mjs --webhook https://.../api/webhooks/paypal
 *
 * Lee PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET (o PAYPAL_LIVE_* con --live)
 * de .env.local. Los precios salen de src/lib/payments/plans.ts (USD).
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const live = args.includes("--live");
const webhookUrl = args[args.indexOf("--webhook") + 1];
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);
const id = live ? env.PAYPAL_LIVE_CLIENT_ID : env.PAYPAL_CLIENT_ID;
const secret = live ? env.PAYPAL_LIVE_CLIENT_SECRET : env.PAYPAL_CLIENT_SECRET;
const BASE = live ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
if (!id || !secret) throw new Error("Faltan credenciales en .env.local");

const PRODUCT_NAME = "Membresía Vivir Creciendo";
const PLANS = [
  { key: "MENSUAL", name: "Membresía mensual", desc: "USD 27 al mes", unit: "MONTH", value: "27" },
  { key: "ANUAL", name: "Membresía anual", desc: "USD 270 al año (2 meses gratis)", unit: "YEAR", value: "270" },
];

const tok = await fetch(`${BASE}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
}).then((r) => r.json());
if (!tok.access_token) throw new Error("Token: " + JSON.stringify(tok));

async function api(path, init = {}) {
  const r = await fetch(BASE + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${tok.access_token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const j = r.status === 204 ? {} : await r.json();
  if (!r.ok) throw new Error(`${init.method ?? "GET"} ${path} -> ${r.status} ${JSON.stringify(j)}`);
  return j;
}

// Product
const products = await api("/v1/catalogs/products?page_size=50");
let product = (products.products ?? []).find((p) => p.name === PRODUCT_NAME);
if (!product) {
  product = await api("/v1/catalogs/products", {
    method: "POST",
    headers: { "PayPal-Request-Id": `vc-product-${Date.now()}` },
    body: {
      name: PRODUCT_NAME,
      description: "Acceso a la comunidad online Vivir Creciendo",
      type: "SERVICE",
      category: "EDUCATIONAL_AND_TEXTBOOKS",
      home_url: "https://vivircreciendo.com",
    },
  });
  console.error("Product creado:", product.id);
} else console.error("Product existente:", product.id);

// Plans
const existing = await api(`/v1/billing/plans?product_id=${product.id}&page_size=20`);
const out = {};
for (const p of PLANS) {
  let plan = (existing.plans ?? []).find((x) => x.name === p.name && x.status === "ACTIVE");
  if (!plan) {
    plan = await api("/v1/billing/plans", {
      method: "POST",
      headers: { "PayPal-Request-Id": `vc-plan-${p.key}-${Date.now()}` },
      body: {
        product_id: product.id,
        name: p.name,
        description: p.desc,
        status: "ACTIVE",
        billing_cycles: [
          {
            frequency: { interval_unit: p.unit, interval_count: 1 },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: { fixed_price: { value: p.value, currency_code: "USD" } },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
      },
    });
    console.error(`Plan ${p.key} creado:`, plan.id);
  } else console.error(`Plan ${p.key} existente:`, plan.id);
  out[`PAYPAL_PLAN_${p.key}`] = plan.id;
}

// Webhook (opcional)
if (webhookUrl) {
  const hooks = await api("/v1/notifications/webhooks");
  let hook = (hooks.webhooks ?? []).find((h) => h.url === webhookUrl);
  if (!hook) {
    hook = await api("/v1/notifications/webhooks", {
      method: "POST",
      body: {
        url: webhookUrl,
        event_types: [
          "BILLING.SUBSCRIPTION.CREATED",
          "BILLING.SUBSCRIPTION.ACTIVATED",
          "BILLING.SUBSCRIPTION.UPDATED",
          "BILLING.SUBSCRIPTION.RE-ACTIVATED",
          "BILLING.SUBSCRIPTION.SUSPENDED",
          "BILLING.SUBSCRIPTION.CANCELLED",
          "BILLING.SUBSCRIPTION.EXPIRED",
          "BILLING.SUBSCRIPTION.PAYMENT.FAILED",
          "PAYMENT.SALE.COMPLETED",
          "PAYMENT.SALE.REFUNDED",
          "PAYMENT.SALE.REVERSED",
        ].map((name) => ({ name })),
      },
    });
    console.error("Webhook creado:", hook.id);
  } else console.error("Webhook existente:", hook.id);
  out.PAYPAL_WEBHOOK_ID = hook.id;
}

console.log(Object.entries(out).map(([k, v]) => `${k}=${v}`).join("\n"));
