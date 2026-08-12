import { createClient } from "@/lib/supabase/server";

/**
 * Voces y testimonios (puntos 9 y 10 de la lista de Ian, 12-ago-2026).
 *
 * Son DOS listas separadas, no una con un campo opcional de video:
 *
 *   `voces`             → carrusel de texto de la portada.
 *   `testimonios_video` → la página /testimonios, con los videos.
 *
 * Se decidió así para que cada pantalla del panel tenga un solo tipo de
 * contenido adentro. El costo: quien deba salir en los dos lugares se carga
 * dos veces.
 *
 * Las tres citas que hasta ahora vivían escritas a mano en `content.ts` ya
 * están migradas a la tabla `voces`.
 */

export interface Voz {
  id: string;
  cita: string;
  nombre: string;
  contexto: string | null;
  /** true = miembro de la comunidad; false = cita de otro ámbito. */
  es_miembro: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface TestimonioVideo {
  id: string;
  nombre: string;
  contexto: string | null;
  titular: string | null;
  descripcion: string | null;
  video_media_id: string | null;
  poster_media_id: string | null;
  is_active: boolean;
  sort_order: number;
  /** Resueltos por el join con media_assets. */
  video_url?: string | null;
  poster_url?: string | null;
}

/** Voces visibles, en el orden del panel. Sin sesión, la RLS ya filtra. */
export async function getVoces(): Promise<Voz[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("voces")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as Voz[];
}

/** Todas las voces, incluidas las ocultas. Solo para el panel. */
export async function getVocesAdmin(): Promise<Voz[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("voces")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as Voz[];
}

type TestimonioRow = TestimonioVideo & {
  video: { url: string } | null;
  poster: { url: string } | null;
};

function resolveMedia(rows: TestimonioRow[]): TestimonioVideo[] {
  return rows.map(({ video, poster, ...t }) => ({
    ...t,
    video_url: video?.url ?? null,
    poster_url: poster?.url ?? null,
  }));
}

const TESTIMONIO_SELECT =
  "*, video:media_assets!testimonios_video_video_media_id_fkey(url), poster:media_assets!testimonios_video_poster_media_id_fkey(url)";

/**
 * Testimonios publicables: visibles Y con video cargado.
 *
 * El filtro por video no es cosmético — una tarjeta de testimonio en video sin
 * video es una promesa incumplida en la única página que existe para verlos.
 */
export async function getTestimoniosVideo(): Promise<TestimonioVideo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonios_video")
    .select(TESTIMONIO_SELECT)
    .eq("is_active", true)
    .not("video_media_id", "is", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return resolveMedia((data ?? []) as unknown as TestimonioRow[]);
}

/** Todos los testimonios, incluidos ocultos y sin video. Solo para el panel. */
export async function getTestimoniosVideoAdmin(): Promise<TestimonioVideo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonios_video")
    .select(TESTIMONIO_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return resolveMedia((data ?? []) as unknown as TestimonioRow[]);
}
