/**
 * Los dos planes de la membresía única, en un solo lugar.
 *
 * Los precios en USD son los que ya publica la landing (`membershipPlans` en
 * content.ts): $27/mes y $270/año. PayPal cobra en USD tal cual. Mercado Pago
 * Argentina solo cobra en pesos, así que ese monto sale de variables de
 * entorno (MP_PRECIO_MENSUAL_ARS / MP_PRECIO_ANUAL_ARS) y lo mantienen las
 * fundadoras según el tipo de cambio.
 *
 * Módulo puro: lo importan componentes de cliente y de servidor.
 */
export type PlanKey = "mensual" | "anual";
export type Provider = "paypal" | "mercadopago";

export interface Plan {
  key: PlanKey;
  nombre: string;
  /** Precio en USD (PayPal). */
  usd: number;
  usdLabel: string;
  /** Cuántos meses cubre cada cobro. */
  meses: number;
  nota: string;
}

export const PLANES: Record<PlanKey, Plan> = {
  mensual: {
    key: "mensual",
    nombre: "Mensual",
    usd: 27,
    usdLabel: "$27 USD / mes",
    meses: 1,
    nota: "Se renueva cada mes. Cancelas cuando quieras.",
  },
  anual: {
    key: "anual",
    nombre: "Anual",
    usd: 270,
    usdLabel: "$270 USD / año",
    meses: 12,
    nota: "Equivale a 10 meses: 2 meses gratis.",
  },
};

export function isPlanKey(v: unknown): v is PlanKey {
  return v === "mensual" || v === "anual";
}

export function isProvider(v: unknown): v is Provider {
  return v === "paypal" || v === "mercadopago";
}

export const PROVIDER_LABEL: Record<Provider, string> = {
  paypal: "PayPal",
  mercadopago: "Mercado Pago",
};
