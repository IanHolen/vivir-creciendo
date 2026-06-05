import { cookies } from "next/headers";

/**
 * Estado de sesión para la landing (vista logueada vs deslogueada).
 *
 * CONTRATO con back (tarea d7c06460):
 *   - Logueado = existe la cookie `vc_session`.
 *   - Override de preview/QA: ?vista=logueado | ?vista=deslogueado.
 *
 * PLACEHOLDER: cuando back conecte la auth real (p. ej. Supabase Auth),
 * reemplazar el cuerpo de getIsLoggedIn() por la validación del token de
 * sesión, manteniendo la misma firma para no tocar las secciones.
 */
export const SESSION_COOKIE = "vc_session";

export async function getIsLoggedIn(searchParams?: {
  vista?: string;
}): Promise<boolean> {
  const vista = searchParams?.vista;
  if (vista === "logueado") return true;
  if (vista === "deslogueado") return false;

  const store = await cookies();
  return store.has(SESSION_COOKIE);
}
