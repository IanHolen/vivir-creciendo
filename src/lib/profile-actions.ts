"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Acciones del perfil del usuario (contrato back f661857c).
 *
 * El usuario solo puede editar SU nombre (rpc update_my_profile, SECURITY
 * DEFINER, gateada por auth.uid()). La membresía (membership_id) y is_admin
 * NO se tocan aquí — eso es admin-only vía set_user_plan / set_admin.
 */

/** Mapea los códigos de error de update_my_profile a mensajes claros 60+. */
function profileErrorMessage(code: string | undefined): string {
  switch (code) {
    case "not_authenticated":
      return "Tu sesión expiró. Inicia sesión de nuevo.";
    case "full_name_too_long":
      return "El nombre es demasiado largo (máximo 120 caracteres).";
    default:
      return code ?? "No se pudo guardar tu nombre.";
  }
}

export async function updateMyProfile(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_my_profile", {
    p_full_name: fullName,
  });

  if (error) {
    redirect("/perfil?error=" + encodeURIComponent(error.message));
  }
  if (data && data.ok === false) {
    redirect("/perfil?error=" + encodeURIComponent(profileErrorMessage(data.error)));
  }

  // El nombre se ve en el navbar ("Hola, X") y en el perfil.
  revalidatePath("/perfil");
  revalidatePath("/");
  redirect("/perfil?ok=1");
}
