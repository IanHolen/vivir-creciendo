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

const ACTIVITY_BUCKET = "activity-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Sube la imagen de una actividad al bucket activity-images (contrato back
 * adc20faa). Escritura admin-only vía RLS en storage.objects; lectura pública
 * vía getPublicUrl. Devuelve la URL pública o lanza redirectError si falla.
 */
async function uploadActivityImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  activityId: string,
  file: File
): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    return redirectError("La imagen es muy grande. Máximo 5 MB.");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${activityId}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from(ACTIVITY_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true });
  if (uploadError) {
    return redirectError("No se pudo subir la imagen: " + uploadError.message);
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from(ACTIVITY_BUCKET).getPublicUrl(path);
  return publicUrl;
}

/** Lee el archivo de imagen del form solo si el admin eligió uno nuevo. */
function getImageFile(formData: FormData): File | null {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) return file;
  return null;
}

function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createActivity(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .insert(parseFields(formData))
    .select("id")
    .single();
  if (error || !data) {
    return redirectError(error?.message ?? "No se pudo crear la actividad.");
  }

  const file = getImageFile(formData);
  if (file) {
    const image_url = await uploadActivityImage(supabase, data.id, file);
    const { error: imgError } = await supabase
      .from("activities")
      .update({ image_url })
      .eq("id", data.id);
    if (imgError) return redirectError(imgError.message);
  }
  revalidate();
}

export async function updateActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();

  // Solo sobre-escribe image_url si el admin subió un archivo nuevo; de lo
  // contrario conserva la imagen actual.
  const fields: Record<string, unknown> = parseFields(formData);
  const file = getImageFile(formData);
  if (file) {
    fields.image_url = await uploadActivityImage(supabase, id, file);
  }

  const { error } = await supabase
    .from("activities")
    .update(fields)
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

/**
 * Restablecer la contraseña de un usuario (recuperación asistida — contrato
 * back 64a815fb, Edge Function admin-set-password, requiere admin). Mientras
 * no haya SMTP para self-service, un admin fija la contraseña nueva.
 */
export async function adminResetPassword(formData: FormData) {
  const target_email = String(formData.get("target_email") ?? "").trim();
  const new_password = String(formData.get("new_password") ?? "");
  if (new_password.length < 8) {
    return redirectError("La contraseña debe tener al menos 8 caracteres.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke("admin-set-password", {
    body: { target_email, new_password },
  });

  if (error || !(data as { ok?: boolean } | null)?.ok) {
    let code = (data as { error?: string } | null)?.error;
    const ctx = (error as { context?: { json?: () => Promise<unknown> } })?.context;
    if (!code && ctx?.json) {
      try {
        code = ((await ctx.json()) as { error?: string })?.error;
      } catch {
        // ignore
      }
    }
    return redirectError(adminPwErrorMessage(code, target_email));
  }

  redirect("/admin?ok=" + encodeURIComponent(`Contraseña actualizada para ${target_email}.`));
}

function adminPwErrorMessage(code: string | undefined, email: string): string {
  switch (code) {
    case "user_not_found":
      return `No existe un usuario con el correo ${email}.`;
    case "not_admin":
      return "No tienes permisos de administrador.";
    case "not_authenticated":
      return "Tu sesión expiró. Inicia sesión de nuevo.";
    case "bad_input":
      return "Revisa el correo y que la contraseña tenga al menos 8 caracteres.";
    default:
      return "No se pudo actualizar la contraseña.";
  }
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
