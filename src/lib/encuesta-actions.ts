"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Responder la encuesta post-actividad (página pública /encuesta/[token]).
 * El token de la URL es la única llave: no hace falta iniciar sesión, que para
 * este público es la mayor barrera. Se puede responder una sola vez.
 */
export async function responderEncuesta(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  if (!token) redirect("/");

  const calificacion = Number(formData.get("calificacion"));
  const comentario = String(formData.get("comentario") ?? "").trim();
  const permite = formData.get("permite_publicar") === "on";
  const nombre = String(formData.get("nombre_publico") ?? "").trim();
  const ciudad = String(formData.get("ciudad") ?? "").trim();

  const volver = (q: string) => redirect(`/encuesta/${encodeURIComponent(token)}?${q}`);
  if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
    volver("error=" + encodeURIComponent("Elige una calificación de 1 a 5."));
  }
  if (permite && !comentario) {
    volver("error=" + encodeURIComponent("Para que podamos publicar tu comentario, escríbelo primero."));
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("encuestas")
    .update({
      calificacion,
      comentario: comentario || null,
      permite_publicar: permite,
      nombre_publico: nombre || null,
      ciudad: ciudad || null,
      respondida_at: new Date().toISOString(),
    })
    .eq("token", token)
    .is("respondida_at", null)
    .select("id")
    .maybeSingle();
  if (error) volver("error=" + encodeURIComponent("No pudimos guardar tu respuesta. Intenta de nuevo."));
  if (!data) volver("ya=1");

  revalidatePath("/admin/encuestas");
  volver("gracias=1");
}

/** Publicar una respuesta como voz del carrusel (admin). */
export async function publicarComoVoz(formData: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  const fail = (m: string): never => redirect("/admin/encuestas?error=" + encodeURIComponent(m));
  if (!isAdmin) fail("No tienes permisos de administrador.");

  const id = String(formData.get("id") ?? "");
  const { data: e } = await supabase.from("encuestas").select("*").eq("id", id).maybeSingle();
  if (!e) fail("No se encontró la encuesta.");
  if (!e.comentario) fail("Esta respuesta no tiene comentario para publicar.");
  if (e.voz_id) fail("Esta respuesta ya está publicada como voz.");

  const { data: ult } = await supabase.from("voces").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const sort = typeof ult?.[0]?.sort_order === "number" ? ult[0].sort_order + 1 : 0;

  const contexto = [e.ciudad, `Participante de ${e.activity_title}`].filter(Boolean).join(" · ");
  const { data: voz, error } = await supabase
    .from("voces")
    .insert({
      cita: e.comentario,
      nombre: e.nombre_publico || "Miembro de la comunidad",
      contexto,
      es_miembro: true,
      is_active: true,
      sort_order: sort,
    })
    .select("id")
    .single();
  if (error || !voz) return fail("No se pudo crear la voz: " + (error?.message ?? ""));

  await supabase.from("encuestas").update({ voz_id: voz.id }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/voces");
  revalidatePath("/admin/encuestas");
  redirect("/admin/encuestas?ok=" + encodeURIComponent("Publicada como voz. Puedes retocarla en «Voces»."));
}
