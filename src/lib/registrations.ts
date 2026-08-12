import { createClient } from "@/lib/supabase/server";

/**
 * Inscripciones y prueba premium (puntos 13 y 13.1 de la lista de Ian).
 *
 * LA REGLA: cualquiera puede anotarse a las actividades gratuitas. A las de
 * paga puede entrar UNA sola vez sin membresía —la prueba— y a partir de la
 * siguiente se le ofrece la membresía.
 *
 * La decisión no se toma en el navegador ni en el servidor de Next: la toma la
 * función `register_for_activity()` de la base, en una sola transacción. Acá
 * solo se lee el estado para saber qué mostrar antes de que la persona pulse.
 * Ese estado es para PINTAR, nunca para autorizar — quien autoriza es la base.
 */

export interface AccessState {
  autenticado: boolean;
  tieneMembresia: boolean;
  pruebaUsada: boolean;
  /** ids de actividades a las que ya está inscrito. */
  inscritas: string[];
}

const ANONIMO: AccessState = {
  autenticado: false,
  tieneMembresia: false,
  pruebaUsada: false,
  inscritas: [],
};

export async function getAccessState(): Promise<AccessState> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("my_access_state");
  if (error || !data) return ANONIMO;

  const d = data as {
    autenticado?: boolean;
    tiene_membresia?: boolean;
    prueba_usada?: boolean;
    inscritas?: string[] | null;
  };

  return {
    autenticado: Boolean(d.autenticado),
    tieneMembresia: Boolean(d.tiene_membresia),
    pruebaUsada: Boolean(d.prueba_usada),
    inscritas: Array.isArray(d.inscritas) ? d.inscritas : [],
  };
}

/**
 * Resultado de intentar inscribirse. `status` es lo que decide qué se le
 * muestra a la persona después de pulsar.
 */
export type RegistroStatus =
  /** Actividad gratuita: se anotó y ya. */
  | "gratuita"
  /** Tiene la membresía: se anotó sin gastar la prueba. */
  | "membresia"
  /** Acaba de gastar su única prueba en una actividad de paga. */
  | "prueba"
  /** Ya estaba anotado; volver a pulsar no vuelve a cobrar la prueba. */
  | "already";

export type RegistroResult =
  | { ok: true; status: RegistroStatus; enlace: string | null }
  | {
      ok: false;
      /** trial_used = ya usó la prueba y no tiene membresía: hay que vender. */
      error: "not_authenticated" | "activity_not_found" | "trial_used" | "desconocido";
      mensaje: string;
    };

export const REGISTRO_ERRORES: Record<string, string> = {
  not_authenticated: "Inicia sesión para inscribirte.",
  activity_not_found: "Esta actividad ya no está disponible.",
  trial_used:
    "Ya usaste tu actividad de prueba. Para seguir participando necesitas la membresía.",
};
