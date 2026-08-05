import { Quote } from "lucide-react";
import { testimonials, testimonialsTitle } from "@/lib/content";

/**
 * Sección 06 — Prueba social.
 *
 * Cada cita lleva su procedencia literal debajo. Las que no son de miembros
 * (citas del Congreso) se muestran atenuadas y sin el sello de miembro, para
 * no dar a entender que la comunidad tiene más testimonios de los que tiene.
 * Cuando lleguen los videos de 30 segundos, reemplazar las cards por embeds.
 */
export default function Testimonials() {
  return (
    // Sección destacada: el doc reserva un tinte suave del color de marca para
    // testimonios y membresías (allí "teal claro"; acá el azul de la marca).
    <section className="bg-vc-blue-soft py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          {testimonialsTitle}
        </h2>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {testimonials.map((t) => (
            <figure
              key={t.quote}
              className={`bg-white rounded-2xl p-8 h-full flex flex-col ${
                t.esMiembro
                  ? "shadow-lg ring-2 ring-vc-orange/30"
                  : "shadow-sm border border-vc-cream"
              }`}
            >
              <Quote
                className="w-8 h-8 text-vc-orange flex-shrink-0"
                aria-hidden="true"
              />
              <blockquote className="mt-4 flex-1 text-lg text-vc-ink leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-vc-cream">
                <span className="block font-semibold text-vc-blue-dark">
                  {t.name}
                </span>
                {/* /70 y no /60: sobre blanco, #232323 al 60% queda en
                    ~3.5:1 y no llega al 4.5:1 que pide WCAG AA. */}
                <span className="block text-base text-vc-ink/70">
                  {t.context}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
