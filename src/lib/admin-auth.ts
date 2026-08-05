import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Puerta única del panel: sesión iniciada + profiles.is_admin.
 *
 * Se usa en las páginas de /admin y TAMBIÉN al principio de cada server action.
 * Las acciones son alcanzables por POST directo sin pasar por la UI, así que
 * confiar solo en la RLS deja la puerta abierta a errores de configuración de
 * la base; esto es la segunda cerradura, no la única.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return { supabase, user, isAdmin: Boolean(profile?.is_admin) };
}

/** Igual que requireAdmin pero corta con redirect si no es admin. */
export async function requireAdminOrRedirect() {
  const ctx = await requireAdmin();
  if (!ctx.isAdmin) redirect("/perfil");
  return ctx;
}
