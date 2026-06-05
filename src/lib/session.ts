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
/** Nombre para mostrar ("Hola, X"). Stub: lo setea el login; back lo tomará del usuario real. */
export const NAME_COOKIE = "vc_name";

export async function getIsLoggedIn(searchParams?: {
  vista?: string;
}): Promise<boolean> {
  const vista = searchParams?.vista;
  if (vista === "logueado") return true;
  if (vista === "deslogueado") return false;

  const store = await cookies();
  return store.has(SESSION_COOKIE);
}

/**
 * Estado de sesión + nombre para mostrar. Misma firma estable: cuando back
 * conecte Supabase Auth, devolverá el usuario real sin tocar los consumidores.
 */
export async function getSessionUser(searchParams?: {
  vista?: string;
}): Promise<{ isLoggedIn: boolean; name: string | null }> {
  const isLoggedIn = await getIsLoggedIn(searchParams);
  if (!isLoggedIn) return { isLoggedIn: false, name: null };
  const store = await cookies();
  return { isLoggedIn, name: store.get(NAME_COOKIE)?.value ?? null };
}
