import { ArrowRight } from "lucide-react";
import { comunidadVentana } from "@/lib/content";
import type { Activity } from "@/lib/activities";

// La sección "Nuestras Actividades" se reemplazó por un bloque único
// "Una Ventana a nuestra Comunidad" (Ian 2026-06-28): se eliminaron las
// tarjetas de actividades y sus botones "Más detalle".
// Mantenemos los props para no tocar page.tsx ni el fetch de actividades;
// ya no se usan en la landing.
export default function FreeActivities({
  activities,
  isLoggedIn,
}: {
  activities?: Activity[];
  isLoggedIn?: boolean;
} = {}) {
  void activities;
  void isLoggedIn;

  return (
    <section
      id="actividades"
      className="scroll-mt-20 md:scroll-mt-24 bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark uppercase tracking-tight">
          {comunidadVentana.title}
        </h2>
        <p className="mt-6 text-lg md:text-xl text-vc-blue-dark/80 leading-relaxed">
          {comunidadVentana.text}
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={comunidadVentana.ctaHref}
            className="inline-flex items-center justify-center gap-2 min-h-[56px] px-10 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg uppercase tracking-wide"
          >
            {comunidadVentana.ctaLabel}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
