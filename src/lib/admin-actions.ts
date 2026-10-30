"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeIcon, normalizePlan } from "@/lib/activities";

/**
 * Mutaciones del panel admin sobre public.activities (contrato back f661857c).
 *
 * Doble cerradura: la RLS de la base exige is_admin, y además cada acción llama
 * a requireAdmin() antes de tocar nada — las server actions son alcanzables por
 * POST directo, sin pasar por la UI.
 */

/** Texto libre del form: recortado, y null si quedó vacío. */
function text(formData: FormData, name: string): string | null {
  const v = String(formData.get(name) ?? "").trim();
  return v === "" ? null : v;
}

function parseFields(formData: FormData) {
  const week = formData.get("week");
  const sortOrder = formData.get("sort_order");
  return {
    title: String(formData.get("title") ?? "").trim(),
    short_preview: String(formData.get("short_preview") ?? "").trim(),
    full_description: text(formData, "full_description"),
    week: week === null || week === "" ? null : Number(week),
    // sort_order es NOT NULL (default 0 en DB): si el admin lo deja en blanco
    // mandamos 0, no null — pasar null viola la constraint (el default solo
    // aplica al OMITIR la columna, no al enviar null explícito).
    sort_order: sortOrder === null || sortOrder === "" ? 0 : Number(sortOrder),
    is_active: formData.get("is_active") === "on",
    // --- campos del sitio real (bc3bc7bb): columnas en español, todas text ---
    fecha: text(formData, "fecha"),
    hora: text(formData, "hora"),
    modalidad: text(formData, "modalidad"),
    duracion: text(formData, "duracion"),
    // Los dos campos que pinta la card de la portada. `icono` se normaliza
    // para que nunca entre a la base un valor que la landing no sepa dibujar.
    frecuencia: text(formData, "frecuencia"),
    icono: normalizeIcon(text(formData, "icono")),
    facilitador: text(formData, "facilitador"),
    facilitador_rol: text(formData, "facilitador_rol"),
    publico_objetivo: text(formData, "publico_objetivo"),
    precio: text(formData, "precio"),
    precio_nota: text(formData, "precio_nota"),
    beneficios: text(formData, "beneficios"),
    enlace_inscripcion: text(formData, "enlace_inscripcion"),
    faq: text(formData, "faq"),
    // Normalizado a la membresía única: guardar siempre el valor canónico va
    // limpiando las filas viejas con "basica"/"plus" a medida que se editan.
    plan: normalizePlan(text(formData, "plan")),
    ...calendarFields(formData),
  };
}

/**
 * Campos del calendario. Solo si el formulario los mostró (cal_habilitado):
 * mientras la migración 2026-10-29 no esté aplicada, mandar columnas que no
 * existen haría fallar el guardado entero.
 */
function calendarFields(formData: FormData): {
  cal_inicio?: string | null;
  cal_zona?: string;
  cal_duracion_min?: number | null;
  cal_repeticion?: string;
} {
  if (formData.get("cal_habilitado") !== "1") return {};
  const inicio = text(formData, "cal_inicio");
  const dur = Number(text(formData, "cal_duracion_min"));
  const rep = text(formData, "cal_repeticion");
  return {
    // datetime-local manda "2026-11-05T16:00": hora de pared, sin zona.
    cal_inicio: inicio && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(inicio) ? inicio : null,
    cal_zona: text(formData, "cal_zona") ?? "America/Mexico_City",
    cal_duracion_min: Number.isInteger(dur) && dur >= 5 && dur <= 1440 ? dur : null,
    cal_repeticion: rep === "semanal" || rep === "mensual" ? rep : "unica",
  };
}

const ACTIVITY_BUCKET = "activity-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

/** Cierra la acción si quien la invoca no es admin (POST directo incluido). */
async function adminClient(): Promise<Supabase> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirectError("No tienes permisos de administrador.");
  return supabase;
}

/**
 * Sube la imagen de una actividad al bucket activity-images (contrato back
 * adc20faa). Escritura admin-only vía RLS en storage.objects; lectura pública
 * vía getPublicUrl. Devuelve la URL pública o lanza redirectError si falla.
 */
async function uploadActivityImage(
  supabase: Supabase,
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
  revalidatePath("/admin", "layout");
  revalidatePath("/");
}

export async function createActivity(formData: FormData) {
  const supabase = await adminClient();
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
  // A la ficha recién creada, no al listado: casi siempre falta algún dato.
  redirect(
    `/admin/actividades/${data.id}?ok=` +
      encodeURIComponent("Actividad creada. Revisa que no falte nada.")
  );
}

export async function updateActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await adminClient();

  // Solo sobre-escribe image_url si el admin subió un archivo nuevo; de lo
  // contrario conserva la imagen actual.
  const fields: Record<string, unknown> = parseFields(formData);
  const file = getImageFile(formData);
  if (file) {
    fields.image_url = await uploadActivityImage(supabase, id, file);
  }

  const { error } = await supabase.from("activities").update(fields).eq("id", id);
  if (error) {
    return redirectError(error.message);
  }
  revalidate();
  redirect(
    `/admin/actividades/${id}?ok=` + encodeURIComponent("Cambios guardados.")
  );
}

export async function deleteActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await adminClient();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) {
    return redirectError(error.message);
  }
  revalidate();
  redirect("/admin?ok=" + encodeURIComponent("Actividad eliminada."));
}

/**
 * Mostrar / ocultar una actividad desde el listado, sin abrir el formulario.
 * `next` viene del form para no depender de leer el estado actual.
 */
export async function toggleActivityActive(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const next = formData.get("next") === "true";
  const supabase = await adminClient();
  const { error } = await supabase
    .from("activities")
    .update({ is_active: next })
    .eq("id", id);
  if (error) return redirectError(error.message);
  revalidate();
}

/**
 * Sube o baja una actividad una posición en el listado.
 *
 * En vez de intercambiar dos `sort_order` (que se rompe con empates y con el 0
 * por defecto que traen las filas viejas), reescribe el orden completo como
 * 0,1,2,… sobre el mismo criterio que usa la UI. Es idempotente y deja la
 * columna en un estado sano después del primer uso.
 */
export async function moveActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const dir = formData.get("dir") === "up" ? -1 : 1;
  if (!id) return;

  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("activities")
    .select("id, sort_order, title");
  if (error || !data) return redirectError(error?.message ?? "No se pudo reordenar.");

  const ordered = [...data].sort(compareForOrder);
  const i = ordered.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i === -1 || j < 0 || j >= ordered.length) return; // ya estaba en el borde

  [ordered[i], ordered[j]] = [ordered[j], ordered[i]];

  for (const [index, row] of ordered.entries()) {
    if (row.sort_order === index) continue;
    const { error: upErr } = await supabase
      .from("activities")
      .update({ sort_order: index })
      .eq("id", row.id);
    if (upErr) return redirectError(upErr.message);
  }
  revalidate();
}

/**
 * Reordena de golpe: recibe los ids en el orden final y reescribe `sort_order`
 * como 0,1,2,… La usa el arrastrar-y-soltar del listado.
 *
 * Un solo viaje en vez de encadenar `moveActivity` una posición por vez: mover
 * la última actividad al primer puesto son N-1 llamadas con `moveActivity`, y
 * cada una revalida y reordena la lista entera.
 *
 * Los ids que falten en la lista (una actividad creada en otra pestaña
 * mientras esta se arrastraba) se conservan al final en vez de quedarse con un
 * `sort_order` viejo que los mezclaría de nuevo.
 */
export async function reorderActivities(ids: string[]) {
  if (!Array.isArray(ids) || ids.length === 0) return;

  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("activities")
    .select("id, sort_order, title");
  if (error || !data) {
    return redirectError(error?.message ?? "No se pudo reordenar.");
  }

  const wanted = ids.filter((id) => data.some((r) => r.id === id));
  const rest = [...data]
    .sort(compareForOrder)
    .map((r) => r.id)
    .filter((id) => !wanted.includes(id));
  const ordered = [...wanted, ...rest];

  for (const [index, id] of ordered.entries()) {
    const row = data.find((r) => r.id === id);
    if (row?.sort_order === index) continue;
    const { error: upErr } = await supabase
      .from("activities")
      .update({ sort_order: index })
      .eq("id", id);
    if (upErr) return redirectError(upErr.message);
  }
  revalidate();
}

/** Mismo criterio de orden que el listado del panel. */
function compareForOrder(
  a: { sort_order: number | null; title: string },
  b: { sort_order: number | null; title: string }
) {
  const sa = a.sort_order ?? Number.MAX_SAFE_INTEGER;
  const sb = b.sort_order ?? Number.MAX_SAFE_INTEGER;
  if (sa !== sb) return sa - sb;
  return a.title.localeCompare(b.title, "es");
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
    return redirectEquipoError("La contraseña debe tener al menos 8 caracteres.");
  }

  const supabase = await adminClient();
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
    return redirectEquipoError(adminPwErrorMessage(code, target_email));
  }

  redirect(
    "/admin/equipo?ok=" +
      encodeURIComponent(`Contraseña actualizada para ${target_email}.`)
  );
}

function redirectEquipoError(msg: string): never {
  redirect("/admin/equipo?error=" + encodeURIComponent(msg));
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

  const supabase = await adminClient();
  const { data, error } = await supabase.rpc("set_admin", {
    p_email: email,
    p_is_admin: isAdmin,
  });

  if (error) return redirectEquipoError(error.message);
  if (data && data.ok === false) {
    return redirectEquipoError(adminErrorMessage(data.error, email));
  }

  revalidatePath("/admin", "layout");
  redirect(
    "/admin/equipo?ok=" +
      encodeURIComponent(
        isAdmin
          ? `${email} ya es administrador.`
          : `Se le quitó el acceso de administrador a ${email}.`
      )
  );
}
