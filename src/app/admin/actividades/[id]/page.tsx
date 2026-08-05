import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2, AlertTriangle } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { updateActivity, deleteActivity } from "@/lib/admin-actions";
import ActivityForm, {
  type AdminActivity,
} from "@/components/admin/ActivityForm";
import { btnGhost, btnDanger } from "@/components/admin/ui";

export default async function EditarActividadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const activity = data as AdminActivity;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-lg font-semibold text-vc-blue hover:text-vc-orange"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Volver a las actividades
          </Link>
          <h2 className="mt-2 font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
            {activity.title}
          </h2>
        </div>
        <Link
          href={`/actividades/${activity.id}`}
          className="inline-flex items-center gap-2 text-lg font-semibold text-vc-blue hover:text-vc-orange"
        >
          Ver en el sitio
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <form action={updateActivity}>
        <input type="hidden" name="id" value={activity.id} />
        <ActivityForm activity={activity} submitLabel="Guardar cambios">
          <Link href="/admin" className={btnGhost}>
            Descartar
          </Link>
        </ActivityForm>
      </form>

      {/*
        Eliminar vive fuera del formulario de edición y detrás de un <details>.
        Antes era un botón rojo pegado a "Guardar cambios": un clic de más y la
        actividad se iba sin preguntar nada. La confirmación es HTML puro, así
        que funciona aunque el JavaScript no haya cargado.
      */}
      <details className="mt-10 group rounded-2xl border-2 border-dashed border-red-200 bg-red-50/40 p-6">
        <summary className="flex items-center gap-2 cursor-pointer list-none text-lg font-semibold text-red-700">
          <Trash2 className="w-5 h-5" aria-hidden="true" />
          Eliminar esta actividad
        </summary>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="flex items-start gap-2 flex-1 min-w-[16rem] text-base text-red-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Se borra para siempre, junto con su página pública. No hay forma de
              recuperarla. Si solo quieres que deje de verse, ciérrala y usa
              «Ocultar» en el listado.
            </span>
          </p>
          <form action={deleteActivity}>
            <input type="hidden" name="id" value={activity.id} />
            <button type="submit" className={btnDanger}>
              <Trash2 className="w-5 h-5" aria-hidden="true" />
              Sí, eliminar «{activity.title}»
            </button>
          </form>
        </div>
      </details>
    </>
  );
}
