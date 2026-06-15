import { createClient } from "@/lib/supabase/server";

/**
 * Actividades de la landing (contrato back f661857c).
 *
 * Lectura SIEMPRE vía rpc get_activities() — un único endpoint para ambos
 * estados: full_description viene NULL si no hay sesión y POBLADO si hay
 * sesión (el gateo lo hace la DB / RLS). No leer public.activities directo.
 */
/**
 * Plan de membresía al que pertenece una actividad (amend chief be8d3813).
 * Se muestra como una etiqueta pequeña en la tarjeta de la landing y en el
 * detalle público. Colores de marca: gratuita=azul, básica/plus=naranja.
 */
export type ActivityPlan = "gratuita" | "basica" | "plus";

export const PLAN_META: Record<ActivityPlan, { label: string; badgeClass: string }> = {
  gratuita: { label: "Gratuita", badgeClass: "bg-vc-blue text-white" },
  basica: { label: "Básica", badgeClass: "bg-vc-orange text-white" },
  plus: { label: "Plus", badgeClass: "bg-vc-blue-dark text-white" },
};

/** Normaliza el texto libre de la columna `plan` a un plan conocido (o null). */
export function planMeta(plan: string | null | undefined) {
  if (!plan) return null;
  return PLAN_META[plan.trim().toLowerCase() as ActivityPlan] ?? null;
}

/** Orden de los planes para agrupar/ordenar en el landing. */
export const PLAN_ORDER: ActivityPlan[] = ["gratuita", "basica", "plus"];

/** Rango de orden de un plan (gratuita=0, basica=1, plus=2, sin/desconocido=último). */
export function planRank(plan: string | null | undefined): number {
  if (!plan) return PLAN_ORDER.length;
  const i = PLAN_ORDER.indexOf(plan.trim().toLowerCase() as ActivityPlan);
  return i === -1 ? PLAN_ORDER.length : i;
}

/** Etiqueta legible de la modalidad (texto libre en DB). */
export function modalidadLabel(m: string | null | undefined): string | null {
  if (!m) return null;
  const key = m.trim().toLowerCase();
  if (key === "online") return "Online";
  if (key === "presencial") return "Presencial";
  if (key === "hibrido" || key === "híbrido") return "Híbrido";
  return m;
}

/**
 * Una actividad tal como la expone la RPC `get_activities()` (contrato back
 * bc3bc7bb, verificado contra el schema desplegado: columnas en español, todas
 * text). `full_description` solo viene poblado con sesión; el resto de campos
 * son públicos (impulsan la inscripción, como el sitio real).
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

  // --- campos del sitio real (bc3bc7bb) — todos text/null en DB ---
  fecha?: string | null; // "Miércoles 16, 23 y 30 de julio"
  hora?: string | null; // "10 hs CDMX / 12 hs ARG"
  modalidad?: string | null; // online | presencial | hibrido
  duracion?: string | null; // "3 sesiones en vivo de 90 min c/u"
  facilitador?: string | null; // "Abigail Sosa Mendoza"
  facilitador_rol?: string | null; // credenciales / rol
  publico_objetivo?: string | null; // "Adultos mayores de 60..."
  precio?: string | null; // "USD 85" (texto libre)
  precio_nota?: string | null; // "Precio especial hasta el 3 de julio"
  beneficios?: string | null; // lista (una por línea)
  enlace_inscripcion?: string | null; // URL de inscripción
  faq?: string | null; // preguntas frecuentes (texto libre)
  plan?: string | null; // gratuita | basica | plus
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
