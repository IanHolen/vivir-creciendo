/**
 * A dónde volver después de entrar o registrarse.
 *
 * Solo rutas internas. Un `next` como "https://otro.com", "//otro.com" o
 * "/\otro.com" (los navegadores convierten la barra invertida en barra)
 * convertiría el login en una redirección abierta desde un dominio de
 * confianza, que es justo el truco de los correos de phishing.
 *
 * Módulo puro: lo usan server actions y páginas.
 */
export function destinoSeguro(v: unknown, fallback = "/"): string {
  if (typeof v !== "string") return fallback;
  const s = v.trim();
  if (!s.startsWith("/") || /^\/[\/\\]/.test(s)) return fallback;
  try {
    const base = "https://vivircreciendo.invalid";
    const u = new URL(s, base);
    if (u.origin !== base) return fallback;
    return u.pathname + u.search + u.hash;
  } catch {
    return fallback;
  }
}
