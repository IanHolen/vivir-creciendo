import { getActivity } from "@/lib/activities";
import { getAccessState } from "@/lib/registrations";
import { icsDe, icsFilename } from "@/lib/calendario";

/**
 * GET /actividades/{id}/calendario → archivo .ics de la actividad.
 *
 * Solo con sesión: el evento lleva la descripción completa y el enlace para
 * entrar, que no se muestran sin sesión. Apple Calendar y Outlook lo abren
 * directo; en Google conviene el enlace de googleCalendarUrl().
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const acceso = await getAccessState();
  if (!acceso.autenticado) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `/actividades/${id}`);
    return Response.redirect(login, 303);
  }

  const activity = await getActivity(id);
  if (!activity) return new Response("Actividad no encontrada", { status: 404 });

  const url = new URL(`/actividades/${activity.id}`, request.url).toString();
  const ics = icsDe(activity, url);
  if (!ics) return new Response("Esta actividad todavía no tiene fecha", { status: 404 });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${icsFilename(activity)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
