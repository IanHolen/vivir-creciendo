import type { Activity } from "@/lib/activities";
import { enlacesCalendario } from "@/lib/calendario";
import BotonesCalendario from "@/components/BotonesCalendario";

/**
 * "Agregar a mi calendario" para una actividad (server component).
 *
 * No renderiza nada si la actividad todavía no tiene fecha estructurada
 * (cal_inicio): mejor sin botón que un evento con fecha inventada.
 */
export default function AgregarCalendario({
  activity,
  compacto = false,
}: {
  activity: Activity;
  compacto?: boolean;
}) {
  const enlaces = enlacesCalendario(activity);
  if (!enlaces) return null;
  return <BotonesCalendario enlaces={enlaces} compacto={compacto} />;
}
