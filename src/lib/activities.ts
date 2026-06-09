import { createClient } from "@/lib/supabase/server";

/**
 * Actividades de la landing (contrato back f661857c).
 *
 * Lectura SIEMPRE vía rpc get_activities() — un único endpoint para ambos
 * estados: full_description viene NULL si no hay sesión y POBLADO si hay
 * sesión (el gateo lo hace la DB / RLS). No leer public.activities directo.
 */
export interface Activity {
  id: string;
  title: string;
  short_preview: string;
  full_description: string | null;
  week: number | null;
  sort_order: number | null;
  /**
   * URL pública de la imagen de la actividad. Opcional: viene del contrato de
   * imágenes de back (task adc20faa); si la RPC aún no la expone llega como
   * undefined/null y la UI cae con elegancia (sin imagen).
   */
  image_url?: string | null;
}

export async function getActivities(): Promise<Activity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_activities");
  if (error || !data) return [];
  return data as Activity[];
}

/** Una sola actividad por id (para la ruta de detalle /actividades/[id]). */
export async function getActivity(id: string): Promise<Activity | null> {
  const activities = await getActivities();
  return activities.find((a) => a.id === id) ?? null;
}
