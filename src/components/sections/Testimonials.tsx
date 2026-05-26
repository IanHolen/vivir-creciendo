import { testimonials } from "@/lib/content";

export default function Testimonials() {
  return (
    <section className="bg-vc-blue noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-white text-center uppercase tracking-tight">
          LO QUE DICEN NUESTROS MIEMBROS
        </h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-vc-cream rounded-2xl p-8 shadow-lg ${
                i === 0 ? "rotate-1" : i === 2 ? "-rotate-1" : ""
              }`}
            >
              <blockquote className="text-vc-blue-dark text-lg leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 pt-4 border-t border-vc-blue-dark/10">
                <p className="font-semibold text-vc-blue-dark">{t.name}</p>
                <p className="text-vc-blue-dark/60 text-base">
                  {t.age} años — {t.country}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-white/60 text-sm">
          [PENDIENTE: testimonios reales]
        </p>
      </div>
    </section>
  );
}
