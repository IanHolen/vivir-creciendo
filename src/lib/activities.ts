import { createClient } from "@/lib/supabase/server";

/**
 * Actividades de la landing (contrato back f661857c).
 *
 * Lectura SIEMPRE vía rpc get_activities() — un único endpoint para ambos
 * estados: full_description viene NULL si no hay sesión y POBLADO si hay
 * sesión (el gateo lo hace la DB / RLS). No leer public.activities directo.
 */
/**
 * Cómo se accede a una actividad.
 *
 * Reestructurado a la MEMBRESÍA ÚNICA del doc: antes había tres niveles
 * (gratuita | basica | plus) que ya no existen en ningún lado de la web. Hoy
 * solo hay dos formas de entrar a una actividad: gratis, o con la membresía.
 *
 * Las filas viejas que todavía tengan "basica"/"plus" en la columna `plan` se
 * normalizan a "membresia" al LEER (ver PLAN_ALIASES), así que nada se rompe
 * sin migrar la base; y como el panel guarda siempre el valor normalizado, la
 * columna se limpia sola a medida que las fundadoras editan cada actividad.
 */
export type ActivityPlan = "gratuita" | "membresia";

export const PLAN_META: Record<
  ActivityPlan,
  { label: string; badgeClass: string; hint: string }
> = {
  gratuita: {
    label: "Gratuita",
    badgeClass: "bg-vc-blue text-white",
    hint: "Abierta a cualquiera.",
  },
  membresia: {
    label: "Membresía",
    badgeClass: "bg-vc-orange text-white",
    hint: "Incluida en la membresía de $30 USD/mes.",
  },
};

/**
 * Texto libre de la columna `plan` → plan conocido. Incluye los valores
 * heredados del esquema de tres niveles para que las actividades ya cargadas
 * sigan mostrando una etiqueta correcta.
 */
const PLAN_ALIASES: Record<string, ActivityPlan> = {
  gratuita: "gratuita",
  gratis: "gratuita",
  free: "gratuita",
  membresia: "membresia",
  membresía: "membresia",
  paga: "membresia",
  basica: "membresia", // heredado
  básica: "membresia", // heredado
  plus: "membresia", // heredado
};

/** Normaliza la columna `plan` a un plan conocido (o null si no hay/no mapea). */
export function normalizePlan(
  plan: string | null | undefined
): ActivityPlan | null {
  if (!plan) return null;
  return PLAN_ALIASES[plan.trim().toLowerCase()] ?? null;
}

/** Metadatos de presentación del plan de una actividad (o null si no tiene). */
export function planMeta(plan: string | null | undefined) {
  const key = normalizePlan(plan);
  return key ? PLAN_META[key] : null;
}

/** Orden de los planes para agrupar/ordenar. */
export const PLAN_ORDER: ActivityPlan[] = ["gratuita", "membresia"];

/** Rango de orden (gratuita=0, membresia=1, sin plan/desconocido=último). */
export function planRank(plan: string | null | undefined): number {
  const key = normalizePlan(plan);
  if (!key) return PLAN_ORDER.length;
  return PLAN_ORDER.indexOf(key);
}

/**
 * Íconos que puede llevar una actividad en el grid de la portada.
 *
 * Data plana A PROPÓSITO: este módulo lo importan server components, server
 * actions y el panel, y traer `lucide-react` hasta acá arrastraría el paquete
 * de íconos a cadenas de importación que no dibujan nada. El mapeo
 * nombre → componente vive en quien pinta (Actividades.tsx, ActivityForm.tsx).
 */
export const ACTIVITY_ICONS = [
  { value: "Film", label: "Película" },
  { value: "Footprints", label: "Caminata" },
  { value: "HeartPulse", label: "Salud" },
  { value: "DoorOpen", label: "Puerta abierta" },
  { value: "Users", label: "Grupo" },
  { value: "Sparkles", label: "Bienestar" },
] as const;

export type ActivityIcon = (typeof ACTIVITY_ICONS)[number]["value"];

/** Ícono cuando la actividad no tiene uno elegido (o guarda un valor viejo). */
export const DEFAULT_ACTIVITY_ICON: ActivityIcon = "Users";

/** Texto libre de la columna `icono` → un ícono que existe en ACTIVITY_ICONS. */
export function normalizeIcon(icono: string | null | undefined): ActivityIcon {
  const match = ACTIVITY_ICONS.find((i) => i.value === icono);
  return match ? match.value : DEFAULT_ACTIVITY_ICON;
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
  // Los dos campos que hacen falta para pintar la card del grid de portada:
  // antes vivían escritos a mano en content.ts y ahora salen de la base, así
  // que las fundadoras pueden editarlos sin tocar código.
  frecuencia?: string | null; // "1 vez por semana"
  icono?: string | null; // ver ACTIVITY_ICONS / normalizeIcon
  facilitador?: string | null; // "Abigail Sosa Mendoza"
  facilitador_rol?: string | null; // credenciales / rol
  publico_objetivo?: string | null; // "Adultos mayores de 60..."
  precio?: string | null; // "USD 85" (texto libre)
  precio_nota?: string | null; // "Precio especial hasta el 3 de julio"
  beneficios?: string | null; // lista (una por línea)
  enlace_inscripcion?: string | null; // URL de inscripción
  faq?: string | null; // preguntas frecuentes (texto libre)
  plan?: string | null; // gratuita | membresia (ver normalizePlan)

  // --- calendario (supabase/migrations/20261029_activities_calendario.sql) ---
  // Opcionales: si la migración aún no está aplicada llegan undefined y la UI
  // no ofrece "Agregar a mi calendario". Ver lib/calendario.ts.
  cal_inicio?: string | null; // "2026-11-05T16:00:00", hora local de cal_zona
  cal_zona?: string | null; // IANA, p. ej. "America/Mexico_City"
  cal_duracion_min?: number | null;
  cal_repeticion?: string | null; // unica | semanal | mensual
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
