import { estarAdentro } from "@/lib/content";

/**
 * Sección 04 — Cómo es estar adentro (documento de las fundadoras, nov-2026).
 *
 * Una descripción de lo que pasa adentro, para que el visitante se imagine
 * participando antes de conocer a las fundadoras y ver el video. Va antes de
 * NOSOTRAS a propósito: primero la experiencia, después quién la sostiene.
 */
export default function EstarAdentro() {
  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 data-reveal className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          {estarAdentro.title}
        </h2>

        <dl className="mt-12 md:mt-16 space-y-8">
          {estarAdentro.items.map((item, i) => (
            <div
              key={item.title}
              data-reveal
              data-reveal-delay={String(i)}
              className="rounded-2xl bg-vc-cream p-7 md:p-8 border-l-4 border-vc-orange"
            >
              <dt className="font-(family-name:--font-display) text-xl md:text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
                {item.title}
              </dt>
              <dd className="mt-3 text-lg md:text-xl text-vc-ink/85 leading-relaxed">
                {item.text}
              </dd>
            </div>
          ))}
        </dl>

        <p data-reveal className="mt-12 text-center text-xl md:text-2xl font-medium text-vc-blue-dark text-balance">
          {estarAdentro.cierre}
        </p>
      </div>
    </section>
  );
}
