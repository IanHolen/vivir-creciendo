"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Mutaciones del panel admin sobre public.activities (contrato back f661857c).
 * La RLS exige is_admin; estas acciones corren con la sesión del usuario, así
 * que un no-admin recibe error de RLS aunque llegue a llamarlas.
 */

function parseFields(formData: FormData) {
  const week = formData.get("week");
  const sortOrder = formData.get("sort_order");
  return {
    title: String(formData.get("title") ?? "").trim(),
    short_preview: String(formData.get("short_preview") ?? "").trim(),
    full_description: String(formData.get("full_description") ?? "").trim(),
    week: week === null || week === "" ? null : Number(week),
    sort_order: sortOrder === null || sortOrder === "" ? null : Number(sortOrder),
    is_active: formData.get("is_active") === "on",
  };
}

function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createActivity(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("activities").insert(parseFields(formData));
  if (error) {
    return redirectError(error.message);
  }
  revalidate();
}

export async function updateActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("activities")
    .update(parseFields(formData))
    .eq("id", id);
  if (error) {
    return redirectError(error.message);
  }
  revalidate();
}

export async function deleteActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) {
    return redirectError(error.message);
  }
  revalidate();
}

function redirectError(msg: string): never {
  redirect("/admin?error=" + encodeURIComponent(msg));
}

/** Mapea los códigos de error de set_admin (back) a mensajes claros 60+. */
function adminErrorMessage(code: string | undefined, email: string): string {
  switch (code) {
    case "user_not_found":
      return `No existe un usuario con el correo ${email}. Pídele que se registre primero.`;
    case "cannot_remove_last_admin":
      return "No puedes quitar al último administrador.";
    case "not_admin":
      return "No tienes permisos de administrador.";
    case "not_authenticated":
      return "Tu sesión expiró. Inicia sesión de nuevo.";
    default:
      return code ?? "No se pudo actualizar el administrador.";
  }
}

/**
 * Promover / revocar admin por email (rpc seguro set_admin de back, restringido
 * a admins). set_admin devuelve {ok, error?, email}.
 */
export async function setAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const isAdmin = formData.get("is_admin") === "true";
  if (!email) return;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("set_admin", {
    p_email: email,
    p_is_admin: isAdmin,
  });

  if (error) return redirectError(error.message);
  if (data && data.ok === false) {
    return redirectError(adminErrorMessage(data.error, email));
  }

  revalidatePath("/admin");
}
