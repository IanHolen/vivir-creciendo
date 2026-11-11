import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Video de las fundadoras: de dónde sale.
 *
 * Las fundadoras pidieron (nov-2026) poder alojarlo en YouTube, que se ve en
 * cualquier navegador y dispositivo. El link se guarda en `site_settings`
 * (clave `video_youtube_url`) desde /admin/multimedia. Si está, se incrusta
 * YouTube; si no, se usa el MP4 de la ranura "hero.video" de siempre.
 */
export const CLAVE_VIDEO_YOUTUBE = "video_youtube_url";

/** ID de 11 caracteres de un link de YouTube (watch, youtu.be, shorts, embed). */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const u = url.trim();
  const m =
    u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/) ??
    u.match(/^([A-Za-z0-9_-]{11})$/);
  return m ? m[1] : null;
}

export async function obtenerVideoYoutube(): Promise<{ url: string | null; id: string | null }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", CLAVE_VIDEO_YOUTUBE)
    .maybeSingle();
  const url = data?.value ?? null;
  return { url, id: youtubeId(url) };
}
