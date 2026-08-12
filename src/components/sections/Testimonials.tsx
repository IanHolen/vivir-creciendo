import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { testimonialsTitle } from "@/lib/content";
import { getVoces, getTestimoniosVideo } from "@/lib/testimonios";
import VocesCarousel from "./VocesCarousel";

/**
 * Sección 06 — Voces de la comunidad.
 *
 * Las citas salen de la tabla `voces` y se administran en /admin/voces; hasta
 * agosto de 2026 vivían escritas a mano en content.ts. Cada una lleva su
 * procedencia debajo, y las que no son de miembros (citas del Congreso) se
 * muestran atenuadas y sin el sello: dar a entender que la comunidad tiene más
 * testimonios de los que tiene cuesta más caro que tener pocos.
 *
 * El carrusel es un componente de cliente aparte; esta sección solo trae los
 * datos. El enlace a /testimonios solo se pinta si hay algún video publicado —
 * mandar a una página vacía es peor que no ofrecerla.
 */
export default async function Testimonials() {
  const [voces, videos] = await Promise.all([getVoces(), getTestimoniosVideo()]);
  if (voces.length === 0 && videos.length === 0) return null;

  return (
    <section className="bg-vc-blue-soft py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          {testimonialsTitle}
        </h2>

        <VocesCarousel voces={voces} />

        {videos.length > 0 && (
          <p className="mt-10 text-center">
            <Link
              href="/testimonios"
              className="inline-flex items-center gap-2 min-h-[52px] px-6 py-3 rounded-xl border-2 border-vc-blue text-vc-blue font-semibold text-lg hover:bg-vc-blue hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange/40"
            >
              Ver {videos.length === 1 ? "el testimonio" : "los testimonios"} en
              video
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
