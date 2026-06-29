import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { comunidadVentana } from "@/lib/content";
import type { Activity } from "@/lib/activities";

// "Una Ventana a nuestra Comunidad" (Ian 2026-06-28). Rediseño de layout
// (29-06): tarjeta a 2 columnas (texto + imagen) que llena el ancho y reduce
// el espacio en blanco vertical. Copy y botón SIN cambios.
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
      className="scroll-mt-20 md:scroll-mt-24 bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch rounded-3xl overflow-hidden border border-vc-cream bg-vc-cream/40 shadow-sm">
          {/* Texto + CTA */}
          <div className="p-8 md:p-12 flex flex-col justify-center text-center lg:text-left">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-black text-vc-blue-dark uppercase tracking-tight">
              {comunidadVentana.title}
            </h2>
            <p className="mt-5 text-lg md:text-xl text-vc-blue-dark/80 leading-relaxed text-justify hyphens-auto">
              {comunidadVentana.text}
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <a
                href={comunidadVentana.ctaHref}
                className="inline-flex items-center justify-center gap-2 min-h-[56px] px-10 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg uppercase tracking-wide"
              >
                {comunidadVentana.ctaLabel}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Imagen — llena la otra mitad (debajo en mobile, derecha en desktop) */}
          <div className="relative w-full h-60 sm:h-72 lg:h-auto lg:min-h-[420px]">
            <Image
              src="/images/comunidad-ventana.jpg"
              alt="Grupo de personas mayores de la comunidad Vivir Creciendo conversando y compartiendo"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
