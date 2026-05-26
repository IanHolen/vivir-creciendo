import { testimonials } from "@/lib/content";

export default function Testimonials() {
  return (
    <section className="bg-vc-cream py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          LO QUE DICEN NUESTROS MIEMBROS
        </h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <blockquote className="text-vc-blue-dark text-lg leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="font-semibold text-vc-blue-dark">{t.name}</p>
                <p className="text-vc-blue-dark/60 text-base">
                  {t.age} años — {t.country}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-vc-blue-dark/40 text-sm">
          [PENDIENTE: testimonios reales]
        </p>
      </div>
    </section>
  );
}
