"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  REGISTRO_ERRORES,
  type RegistroResult,
  type RegistroStatus,
} from "@/lib/registrations";
import { getActivity } from "@/lib/activities";
import { enviarConfirmacionActividad } from "@/lib/email/confirmacion-actividad";
import { enlacesCalendario } from "@/lib/calendario";

/**
 * Inscribirse a una actividad.
 *
 * Es una envoltura fina alrededor de la RPC `register_for_activity()`: toda la
 * lógica —¿es gratuita?, ¿tiene membresía?, ¿le queda la prueba?— vive en la
 * base, en una sola transacción, y esta función solo traduce la respuesta.
 *
 * Se hace así y no en TypeScript porque entre "leer si le queda la prueba" y
 * "marcarla como usada" hay una ventana: dos pestañas abiertas a la vez
 * podrían gastar la misma prueba dos veces. En la base, el chequeo y la marca
 * son la misma transacción.
 *
 * Devuelve un objeto en vez de redirigir: quien la llama es un componente de
 * cliente que necesita el resultado para decidir qué ventana emergente abrir.
 */
export async function inscribirse(activityId: string): Promise<RegistroResult> {
  if (!activityId) {
    return {
      ok: false,
      error: "activity_not_found",
      mensaje: REGISTRO_ERRORES.activity_not_found,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("register_for_activity", {
    p_activity_id: activityId,
  });

  if (error || !data) {
    return {
      ok: false,
      error: "desconocido",
      mensaje: "No pudimos completar la inscripción. Vuelve a intentarlo.",
    };
  }

  const r = data as {
    ok?: boolean;
    status?: RegistroStatus;
    enlace?: string | null;
    error?: string;
  };

  if (!r.ok) {
    const code = (r.error ?? "desconocido") as
      | "not_authenticated"
      | "activity_not_found"
      | "trial_used"
      | "desconocido";
    return {
      ok: false,
      error: code,
      mensaje:
        REGISTRO_ERRORES[code] ??
        "No pudimos completar la inscripción. Vuelve a intentarlo.",
    };
  }

  // El perfil muestra las actividades a las que la persona está anotada, y la
  // ficha cambia de "Quiero inscribirme" a "Ya estás inscrito".
  revalidatePath("/perfil");
  revalidatePath(`/actividades/${activityId}`);

  const status = (r.status ?? "gratuita") as RegistroStatus;
  // Con sesión: trae la descripción completa para el correo y el calendario.
  const activity = await getActivity(activityId);

  // Correo de confirmación con toda la actividad y el .ics para el
  // calendario. Va en after(): la persona ve su confirmación al instante y el
  // envío (1-2 s) corre después. Si ya estaba inscrita no se reenvía.
  if (status !== "already" && activity) {
    after(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) return;
      const { data: perfil } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      await enviarConfirmacionActividad({
        to: user.email,
        nombre: perfil?.full_name ?? null,
        activity,
        status,
      });
    });
  }

  return {
    ok: true,
    status,
    enlace: r.enlace ?? null,
    calendario: activity ? enlacesCalendario(activity) : null,
  };
}
