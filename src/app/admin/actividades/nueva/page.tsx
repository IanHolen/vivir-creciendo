import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createActivity } from "@/lib/admin-actions";
import ActivityForm from "@/components/admin/ActivityForm";
import { btnGhost } from "@/components/admin/ui";

export const metadata = {
  title: "Nueva actividad — Panel de Vivir Creciendo",
};

export default function NuevaActividadPage() {
  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-lg font-semibold text-vc-blue hover:text-vc-orange"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Volver a las actividades
        </Link>
        <h2 className="mt-2 font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
          Nueva actividad
        </h2>
        <p className="mt-1 text-base text-vc-ink/60">
          Solo el título es obligatorio. Puedes guardar y completar el resto
          después.
        </p>
      </div>

      <form action={createActivity}>
        <ActivityForm submitLabel="Crear actividad">
          <Link href="/admin" className={btnGhost}>
            Cancelar
          </Link>
        </ActivityForm>
      </form>
    </>
  );
}
