"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { CLAVE_VIDEO_YOUTUBE, youtubeId } from "@/lib/video-fundadoras";

/**
 * Guardar (o quitar) el link de YouTube del video de las fundadoras desde
 * /admin/multimedia. Vacío = volver al MP4 de la ranura "hero.video".
 */
export async function guardarVideoYoutube(formData: FormData) {
  const { supabase, user, isAdmin } = await requireAdmin();
  const volver = (q: string) => redirect("/admin/multimedia?" + q);
  if (!isAdmin) volver("error=" + encodeURIComponent("No tienes permisos de administrador."));

  const url = String(formData.get("url") ?? "").trim();
  if (url && !youtubeId(url)) {
    volver(
      "error=" +
        encodeURIComponent(
          "Ese no parece un link de YouTube. Copia la dirección del video (por ejemplo https://youtu.be/XXXXXXXXXXX)."
        )
    );
  }

  const { error } = await supabase.from("site_settings").upsert(
    { key: CLAVE_VIDEO_YOUTUBE, value: url, updated_at: new Date().toISOString(), updated_by: user.id },
    { onConflict: "key" }
  );
  if (error) volver("error=" + encodeURIComponent("No se pudo guardar el link: " + error.message));

  revalidatePath("/");
  revalidatePath("/admin/multimedia");
  volver(
    "ok=" +
      encodeURIComponent(
        url
          ? "Listo: la portada muestra el video desde YouTube."
          : "Link quitado: la portada vuelve a mostrar el archivo de video de la ranura."
      )
  );
}
