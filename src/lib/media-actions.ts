"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { MEDIA_BUCKET, MEDIA_MAX_BYTES, findSlot, type MediaKind } from "@/lib/media";

/**
 * Mutaciones del panel de Multimedia (/admin/multimedia).
 *
 * La subida NO pasa por acá: el archivo va directo del navegador al Storage
 * con una URL firmada (ver `crearSubidaFirmada`). Estas acciones solo emiten
 * el permiso y anotan el resultado en la base — así un video de 80 MB nunca
 * atraviesa la función de Next.
 */

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

async function adminClient(): Promise<Supabase> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) fail("No tienes permisos de administrador.");
  return supabase;
}

function fail(msg: string): never {
  redirect("/admin/multimedia?error=" + encodeURIComponent(msg));
}

function ok(msg: string): never {
  redirect("/admin/multimedia?ok=" + encodeURIComponent(msg));
}

function revalidate() {
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidatePath("/nosotros");
  revalidatePath("/testimonios");
}

function text(formData: FormData, name: string): string | null {
  const v = String(formData.get(name) ?? "").trim();
  return v === "" ? null : v;
}

/** Nombre de archivo seguro dentro del bucket. */
function safeName(filename: string): string {
  const clean = filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tildes: "canción.mp4" -> "cancion.mp4"
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(-120);
  return clean || "archivo";
}

/**
 * Paso 1 de la subida: emite una URL firmada para que el navegador escriba
 * directo en el bucket. Devuelve `{ path, token }` — sin ellos el navegador no
 * puede escribir nada, porque la RLS del bucket solo deja pasar a admins.
 *
 * Devuelve un objeto de error en vez de redirigir: la llama JavaScript desde
 * el cliente, no un <form>, y un redirect ahí no se ve.
 */
export async function crearSubidaFirmada(
  filename: string,
  kind: MediaKind
): Promise<
  | { ok: true; path: string; token: string; signedUrl: string }
  | { ok: false; error: string }
> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No tienes permisos." };
  if (kind !== "imagen" && kind !== "video") {
    return { ok: false, error: "Tipo de archivo no reconocido." };
  }

  const path = `${kind}/${Date.now()}-${safeName(filename)}`;
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return { ok: false, error: error?.message ?? "No se pudo preparar la subida." };
  }
  return { ok: true, path: data.path, token: data.token, signedUrl: data.signedUrl };
}

/**
 * Paso 2: el archivo ya está en el bucket; se anota en la biblioteca.
 *
 * Verifica contra el Storage que el objeto exista de verdad antes de crear la
 * fila. Sin esa comprobación, un cliente podría inventar rutas y llenar la
 * biblioteca de entradas que apuntan a archivos inexistentes.
 */
export async function registrarArchivo(input: {
  path: string;
  filename: string;
  kind: MediaKind;
  descripcion?: string | null;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No tienes permisos." };

  const carpeta = input.path.includes("/")
    ? input.path.slice(0, input.path.lastIndexOf("/"))
    : "";
  const nombre = input.path.slice(input.path.lastIndexOf("/") + 1);

  const { data: objetos, error: listError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(carpeta, { search: nombre, limit: 1 });

  const objeto = objetos?.find((o) => o.name === nombre);
  if (listError || !objeto) {
    return { ok: false, error: "El archivo no llegó al servidor. Prueba de nuevo." };
  }

  const bytes = (objeto.metadata?.size as number | undefined) ?? null;
  const mime = (objeto.metadata?.mimetype as string | undefined) ?? null;
  if (bytes && bytes > MEDIA_MAX_BYTES) {
    await supabase.storage.from(MEDIA_BUCKET).remove([input.path]);
    return { ok: false, error: "El archivo supera los 200 MB." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(input.path);

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      kind: input.kind,
      storage_path: input.path,
      url: publicUrl,
      filename: input.filename,
      descripcion: input.descripcion?.trim() || null,
      bytes,
      mime,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "No se pudo guardar el archivo." };
  }

  revalidate();
  return { ok: true, id: data.id };
}

/** Editar la descripción de un archivo de la biblioteca. */
export async function actualizarArchivo(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await adminClient();

  const { error } = await supabase
    .from("media_assets")
    .update({ descripcion: text(formData, "descripcion") })
    .eq("id", id);

  if (error) fail(error.message);
  revalidate();
  ok("Descripción guardada.");
}

/**
 * Borrar un archivo: primero la fila, después el objeto del bucket.
 *
 * En ese orden a propósito. Si falla el borrado del objeto queda un archivo
 * huérfano en el Storage —invisible y barato—; al revés quedaría una fila que
 * apunta a un archivo que ya no existe, y eso sí se ve como una imagen rota en
 * la portada.
 *
 * Las ranuras y los testimonios que lo usaban quedan en null (on delete set
 * null) y vuelven solos a su archivo por defecto.
 */
export async function borrarArchivo(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await adminClient();

  const { data: asset } = await supabase
    .from("media_assets")
    .select("storage_path, filename")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) fail(error.message);

  if (asset?.storage_path) {
    await supabase.storage.from(MEDIA_BUCKET).remove([asset.storage_path]);
  }

  revalidate();
  ok(`Se eliminó "${asset?.filename ?? "el archivo"}".`);
}

/**
 * Núcleo del guardado de una ranura, compartido por el <form> del panel y por
 * el subidor. Devuelve el resultado; quien llama decide si redirige o no.
 */
async function guardarRanura(
  slot: string,
  mediaId: string,
  alt: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const def = findSlot(slot);
  if (!def) return { ok: false, error: "Esa ubicación no existe." };

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No tienes permisos de administrador." };

  if (mediaId) {
    // Que la ranura del video no termine con una foto adentro.
    const { data: asset } = await supabase
      .from("media_assets")
      .select("kind")
      .eq("id", mediaId)
      .single();
    if (!asset) return { ok: false, error: "Ese archivo ya no está en la biblioteca." };
    if (asset.kind !== def.kind) {
      return {
        ok: false,
        error: `"${def.label}" necesita ${def.kind === "video" ? "un video" : "una imagen"}.`,
      };
    }
  }

  const { error } = await supabase.from("site_media").upsert(
    {
      slot,
      media_id: mediaId || null,
      alt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slot" }
  );

  if (error) return { ok: false, error: error.message };
  revalidate();
  return { ok: true };
}

/**
 * Asignar (o vaciar) una ranura del sitio.
 *
 * Vaciarla no borra el archivo: la ranura vuelve a mostrar el archivo por
 * defecto que trae el código.
 */
export async function asignarRanura(formData: FormData) {
  const slot = String(formData.get("slot") ?? "");
  const mediaId = String(formData.get("media_id") ?? "");
  const def = findSlot(slot);

  const res = await guardarRanura(slot, mediaId, text(formData, "alt"));
  if (!res.ok) fail(res.error);

  const label = def?.label ?? "El archivo";
  ok(mediaId ? `"${label}" actualizado.` : `"${label}" volvió al archivo por defecto.`);
}

/**
 * Igual que `asignarRanura`, pero para el subidor: cuando alguien sube una
 * foto desde adentro de una ranura, el archivo tiene que quedar puesto ahí
 * mismo sin un segundo paso.
 *
 * Devuelve el resultado en vez de redirigir — la llama JavaScript, y un
 * redirect en una server action llamada desde el cliente no se ve.
 */
export async function usarEnRanura(
  slot: string,
  mediaId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  // `alt` en null: se queda el texto de fábrica de la ranura hasta que alguien
  // escriba uno propio en el formulario de al lado.
  return guardarRanura(slot, mediaId, null);
}
