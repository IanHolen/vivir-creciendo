/**
 * Píxel de Meta (Facebook) — pedido del equipo de anuncios (nov-2026).
 *
 * El ID puede cambiarse sin tocar código con NEXT_PUBLIC_META_PIXEL_ID en
 * Vercel; si la variable no está, se usa el píxel de la comunidad. Para
 * apagarlo del todo: NEXT_PUBLIC_META_PIXEL_ID="off".
 */
export const META_PIXEL_ID: string | null = (() => {
  const v = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  if (v === "off") return null;
  return v || "616067254125807";
})();

export type MetaEvento =
  | "PageView"
  | "Lead"
  | "Contact"
  | "InitiateCheckout"
  | "Purchase"
  | "Subscribe"
  | "CompleteRegistration";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/**
 * Dispara un evento estándar del píxel. Nunca lanza: si el píxel no cargó
 * (bloqueador, sin JS, en el servidor) simplemente no pasa nada.
 * `eventId` permite que Meta deduplique si el mismo evento llega dos veces.
 */
export function metaTrack(
  evento: MetaEvento,
  params?: Record<string, string | number | boolean | string[]>,
  eventId?: string
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    if (eventId) window.fbq("track", evento, params ?? {}, { eventID: eventId });
    else window.fbq("track", evento, params ?? {});
  } catch {
    /* el píxel nunca debe romper la página */
  }
}
