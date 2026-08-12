"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Alta, edición, orden y baja de las dos listas de testimonios:
 * `voces` (carrusel de la portada) y `testimonios_video` (página /testimonios).
 *
 * Las dos tablas tienen la misma forma de administración —mostrar/ocultar,
 * subir/bajar, borrar— así que las funciones de orden y visibilidad están
 * escritas una sola vez y reciben el nombre de la tabla.
 */

type Tabla = "voces" | "testimonios_video";

const RUTA: Record<Tabla, string> = {
  voces: "/admin/voces",
  testimonios_video: "/admin/testimonios",
};

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

async function adminClient(tabla: Tabla): Promise<Supabase> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) fail(tabla, "No tienes permisos de administrador.");
  return supabase;
}

function fail(tabla: Tabla, msg: string): never {
  redirect(`${RUTA[tabla]}?error=` + encodeURIComponent(msg));
}

function done(tabla: Tabla, msg: string): never {
  redirect(`${RUTA[tabla]}?ok=` + encodeURIComponent(msg));
}

function revalidate(tabla: Tabla) {
  revalidatePath("/admin", "layout");
  revalidatePath(tabla === "voces" ? "/" : "/testimonios");
}

function text(formData: FormData, name: string): string | null {
  const v = String(formData.get(name) ?? "").trim();
  return v === "" ? null : v;
}

/** Posición siguiente al final de la lista. */
async function siguienteOrden(supabase: Supabase, tabla: Tabla): Promise<number> {
  const { data } = await supabase
    .from(tabla)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const ultimo = data?.[0]?.sort_order;
  return typeof ultimo === "number" ? ultimo + 1 : 0;
}

// ---------------------------------------------------------------------------
// Voces
// ---------------------------------------------------------------------------

export async function guardarVoz(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await adminClient("voces");

  const cita = String(formData.get("cita") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!cita || !nombre) fail("voces", "La cita y el nombre son obligatorios.");

  const fields = {
    cita,
    nombre,
    contexto: text(formData, "contexto"),
    // Por defecto NO es miembro: si alguien se olvida de marcarlo, el error
    // seguro es atenuar una cita real, no presentar como testimonio de la
    // comunidad algo que no lo es.
    es_miembro: formData.get("es_miembro") === "on",
    is_active: formData.get("is_active") === "on",
  };

  if (id) {
    const { error } = await supabase.from("voces").update(fields).eq("id", id);
    if (error) fail("voces", error.message);
    revalidate("voces");
    done("voces", "Voz actualizada.");
  }

  const { error } = await supabase
    .from("voces")
    .insert({ ...fields, sort_order: await siguienteOrden(supabase, "voces") });
  if (error) fail("voces", error.message);
  revalidate("voces");
  done("voces", `Se agregó la voz de ${nombre}.`);
}

// ---------------------------------------------------------------------------
// Testimonios en video
// ---------------------------------------------------------------------------

export async function guardarTestimonio(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await adminClient("testimonios_video");

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) fail("testimonios_video", "El nombre es obligatorio.");

  const fields = {
    nombre,
    contexto: text(formData, "contexto"),
    titular: text(formData, "titular"),
    descripcion: text(formData, "descripcion"),
    video_media_id: text(formData, "video_media_id"),
    poster_media_id: text(formData, "poster_media_id"),
    is_active: formData.get("is_active") === "on",
  };

  if (id) {
    const { error } = await supabase
      .from("testimonios_video")
      .update(fields)
      .eq("id", id);
    if (error) fail("testimonios_video", error.message);
    revalidate("testimonios_video");
    done("testimonios_video", "Testimonio actualizado.");
  }

  const { error } = await supabase.from("testimonios_video").insert({
    ...fields,
    sort_order: await siguienteOrden(supabase, "testimonios_video"),
  });
  if (error) fail("testimonios_video", error.message);
  revalidate("testimonios_video");
  done("testimonios_video", `Se agregó el testimonio de ${nombre}.`);
}

// ---------------------------------------------------------------------------
// Compartido: visibilidad, orden y baja
// ---------------------------------------------------------------------------

export async function alternarVisible(formData: FormData) {
  const tabla = String(formData.get("tabla") ?? "") as Tabla;
  const id = String(formData.get("id") ?? "");
  if (!RUTA[tabla] || !id) return;
  const next = formData.get("next") === "true";

  const supabase = await adminClient(tabla);
  const { error } = await supabase
    .from(tabla)
    .update({ is_active: next })
    .eq("id", id);
  if (error) fail(tabla, error.message);
  revalidate(tabla);
}

/**
 * Sube o baja una posición.
 *
 * Reescribe el orden completo como 0,1,2,… en lugar de intercambiar dos
 * `sort_order` — es el mismo criterio que ya usa el listado de actividades, y
 * por el mismo motivo: intercambiar se rompe cuando hay empates o cuando las
 * filas viejas arrastran el 0 por defecto.
 */
export async function moverItem(formData: FormData) {
  const tabla = String(formData.get("tabla") ?? "") as Tabla;
  const id = String(formData.get("id") ?? "");
  if (!RUTA[tabla] || !id) return;
  const dir = formData.get("dir") === "up" ? -1 : 1;

  const supabase = await adminClient(tabla);
  const { data, error } = await supabase
    .from(tabla)
    .select("id, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) fail(tabla, error?.message ?? "No se pudo reordenar.");

  const ordered = [...data];
  const i = ordered.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i === -1 || j < 0 || j >= ordered.length) return; // ya estaba en el borde

  [ordered[i], ordered[j]] = [ordered[j], ordered[i]];

  for (const [index, row] of ordered.entries()) {
    if (row.sort_order === index) continue;
    const { error: upErr } = await supabase
      .from(tabla)
      .update({ sort_order: index })
      .eq("id", row.id);
    if (upErr) fail(tabla, upErr.message);
  }
  revalidate(tabla);
}

export async function borrarItem(formData: FormData) {
  const tabla = String(formData.get("tabla") ?? "") as Tabla;
  const id = String(formData.get("id") ?? "");
  if (!RUTA[tabla] || !id) return;

  const supabase = await adminClient(tabla);
  const { error } = await supabase.from(tabla).delete().eq("id", id);
  if (error) fail(tabla, error.message);
  revalidate(tabla);
  done(
    tabla,
    tabla === "voces" ? "Voz eliminada." : "Testimonio eliminado."
  );
}
