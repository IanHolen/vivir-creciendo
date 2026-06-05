import { createClient } from "@/lib/supabase/server";

/**
 * Estado de sesión para la landing (vista logueada vs deslogueada).
 *
 * CONTRATO con back (f661857c): auth real = Supabase Auth.
 *   - Logueado = supabase.auth.getUser() devuelve un usuario.
 *   - Override de preview/QA: ?vista=logueado | ?vista=deslogueado.
 */

export async function getIsLoggedIn(searchParams?: {
  vista?: string;
}): Promise<boolean> {
  const vista = searchParams?.vista;
  if (vista === "logueado") return true;
  if (vista === "deslogueado") return false;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user != null;
}

/**
 * Estado de sesión + nombre para mostrar ("Hola, X"). Misma firma estable.
 */
export async function getSessionUser(searchParams?: {
  vista?: string;
}): Promise<{ isLoggedIn: boolean; name: string | null }> {
  const vista = searchParams?.vista;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn =
    vista === "logueado" ? true : vista === "deslogueado" ? false : user != null;
  if (!isLoggedIn) return { isLoggedIn: false, name: null };

  const name =
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    null;
  return { isLoggedIn, name };
}
