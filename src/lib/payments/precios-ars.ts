import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PlanKey } from "./plans";

/**
 * Precios en pesos argentinos de Mercado Pago.
 *
 * Los definen las fundadoras desde /admin/suscripciones y viven en
 * `site_settings` (claves `mp_precio_mensual_ars` / `mp_precio_anual_ars`).
 * Si todavía no los cargaron, se cae a las variables de entorno
 * MP_PRECIO_MENSUAL_ARS / MP_PRECIO_ANUAL_ARS; si tampoco están, Mercado
 * Pago queda apagado y en /membresia solo se puede pagar con PayPal.
 */
export const CLAVES_ARS: Record<PlanKey, string> = {
  mensual: "mp_precio_mensual_ars",
  anual: "mp_precio_anual_ars",
};

/** Mínimo razonable: evita que "27.000" leído como 27 cobre 27 pesos. */
export const ARS_MINIMO = 1000;

export type PreciosArs = Record<PlanKey, number | null>;

/** Entero ≥ ARS_MINIMO, o null. Acepta "27.000" y "27000". */
export function parsearArs(raw: unknown): number | null {
  const limpio = String(raw ?? "").replace(/[.\s$]/g, "").replace(",", ".");
  if (limpio === "") return null;
  const n = Number(limpio);
  return Number.isInteger(n) && n >= ARS_MINIMO ? n : null;
}

export async function obtenerPreciosArs(): Promise<PreciosArs> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", Object.values(CLAVES_ARS));
  const porClave = new Map((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
  return {
    mensual: parsearArs(porClave.get(CLAVES_ARS.mensual) ?? process.env.MP_PRECIO_MENSUAL_ARS),
    anual: parsearArs(porClave.get(CLAVES_ARS.anual) ?? process.env.MP_PRECIO_ANUAL_ARS),
  };
}

export function preciosCompletos(p: PreciosArs): p is Record<PlanKey, number> {
  return p.mensual != null && p.anual != null;
}
