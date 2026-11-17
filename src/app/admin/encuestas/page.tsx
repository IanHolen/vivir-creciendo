import { MessageSquareQuote, Inbox, Star, CheckCircle2, Mail } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { Card, btnBlue, hintClass } from "@/components/admin/ui";
import BotonAccion from "@/components/admin/BotonAccion";
import { publicarComoVoz } from "@/lib/encuesta-actions";

export const metadata = { title: "Encuestas — Panel de Vivir Creciendo" };
export const dynamic = "force-dynamic";

interface Encuesta {
  id: string;
  user_id: string;
  activity_title: string;
  enviada_at: string;
  respondida_at: string | null;
  calificacion: number | null;
  comentario: string | null;
  permite_publicar: boolean;
  nombre_publico: string | null;
  ciudad: string | null;
  voz_id: string | null;
}

function fecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * /admin/encuestas — respuestas a la encuesta post-actividad.
 *
 * Lo que más importa está arriba: comentarios con permiso para publicar que
 * todavía no son voz, con un botón para convertirlos. Debajo, todo lo demás,
 * para leer cómo vienen las actividades.
 */
export default async function EncuestasPage() {
  const { supabase } = await requireAdmin();
  const [{ data: rows }, { data: perfiles }, { data: enviados }] = await Promise.all([
    supabase.from("encuestas").select("*").order("respondida_at", { ascending: false, nullsFirst: false }).limit(300),
    supabase.from("profiles").select("id,email,full_name"),
    supabase.from("correos_enviados").select("tipo").order("enviado_at", { ascending: false }).limit(1000),
  ]);
  const encuestas = (rows ?? []) as Encuesta[];
  const porUsuario = new Map(((perfiles ?? []) as { id: string; email: string | null; full_name: string | null }[]).map((p) => [p.id, p]));
  const respondidas = encuestas.filter((e) => e.respondida_at);
  const paraPublicar = respondidas.filter((e) => e.permite_publicar && e.comentario && !e.voz_id);
  const promedio = respondidas.length
    ? (respondidas.reduce((s, e) => s + (e.calificacion ?? 0), 0) / respondidas.length).toFixed(1)
    : null;
  const conteo = (tipo: string) => ((enviados ?? []) as { tipo: string }[]).filter((c) => c.tipo === tipo).length;

  return (
    <>
      <div>
        <h2 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
          Encuestas
        </h2>
        <p className="mt-1 text-base text-vc-ink/60">
          Al día siguiente de cada actividad se manda una encuesta por correo. {respondidas.length} de {encuestas.length} respondidas
          {promedio ? ` · promedio ${promedio} de 5` : ""}. Correos automáticos enviados: {conteo("bienvenida")} de bienvenida, {conteo("encuesta")} encuestas, {conteo("invitacion")} invitaciones.
        </p>
      </div>

      <Card icon={MessageSquareQuote} title={`Listas para publicar como voz (${paraPublicar.length})`} hint="Comentarios con permiso explícito de la persona. Al publicar, aparece en el carrusel de la portada y se puede retocar en «Voces»." className="mt-6">
        {paraPublicar.length === 0 ? (
          <p className="text-lg text-vc-ink/70">Por ahora no hay comentarios nuevos con permiso para publicar.</p>
        ) : (
          <ul className="space-y-4">
            {paraPublicar.map((e) => (
              <li key={e.id} className="rounded-2xl border border-vc-cream bg-white p-5">
                <blockquote className="text-lg text-vc-ink leading-relaxed">“{e.comentario}”</blockquote>
                <p className="mt-2 text-base text-vc-ink/70">
                  {e.nombre_publico || "Miembro de la comunidad"}{e.ciudad ? ` · ${e.ciudad}` : ""} · {e.activity_title} · {e.calificacion}/5 · {fecha(e.respondida_at)}
                </p>
                <form action={publicarComoVoz} className="mt-4">
                  <input type="hidden" name="id" value={e.id} />
                  <BotonAccion pendiente="Publicando…" className={`${btnBlue} min-h-[44px] text-base`}>
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    Publicar como voz
                  </BotonAccion>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card icon={Star} title="Todas las respuestas" className="mt-6">
        {respondidas.length === 0 ? (
          <div className="py-10 text-center">
            <Inbox className="w-10 h-10 mx-auto text-vc-ink/25" aria-hidden="true" />
            <p className="mt-3 text-lg text-vc-ink/70">Todavía nadie respondió una encuesta.</p>
            <p className={`${hintClass} mt-2 flex items-center justify-center gap-2`}><Mail className="w-4 h-4" aria-hidden="true" /> Las encuestas salen solas al día siguiente de cada actividad con fecha de calendario cargada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-base min-w-[44rem]">
              <thead>
                <tr className="text-left text-sm uppercase tracking-wide text-vc-ink/50 border-b border-vc-cream">
                  <th className="py-2 px-2">Persona</th>
                  <th className="py-2 px-2">Actividad</th>
                  <th className="py-2 px-2">Nota</th>
                  <th className="py-2 px-2">Comentario</th>
                  <th className="py-2 px-2">Permiso</th>
                  <th className="py-2 px-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {respondidas.map((e) => {
                  const p = porUsuario.get(e.user_id);
                  return (
                    <tr key={e.id} className="border-b border-vc-cream/70 align-top">
                      <td className="py-3 px-2">
                        <span className="block font-semibold text-vc-blue-dark">{p?.full_name ?? "—"}</span>
                        <span className="block text-sm text-vc-ink/60 break-all">{p?.email ?? ""}</span>
                      </td>
                      <td className="py-3 px-2">{e.activity_title}</td>
                      <td className="py-3 px-2 whitespace-nowrap">{e.calificacion}/5</td>
                      <td className="py-3 px-2 max-w-md">{e.comentario ?? <span className="text-vc-ink/40">—</span>}</td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {e.voz_id ? "Publicada" : e.permite_publicar ? "Sí" : "No"}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">{fecha(e.respondida_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
