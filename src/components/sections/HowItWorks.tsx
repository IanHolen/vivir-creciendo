import { comoFunciona } from "@/lib/content";

/**
 * Sección 05 — Cómo funciona.
 *
 * Tres pasos con el número grande en naranja como elemento decorativo
 * (aria-hidden: el orden ya lo comunica la lista ordenada). Horizontal en
 * desktop, vertical en mobile.
 */
export default function HowItWorks() {
  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight text-balance">
          {comoFunciona.title}
        </h2>
        <p className="mt-4 text-center text-lg md:text-xl text-vc-ink/80">
          {comoFunciona.subtitle}
        </p>

        <ol className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {comoFunciona.steps.map((step) => (
            <li key={step.n}>
              <span
                // 60-80px según el doc: el número es decoración, tiene que pesar.
                className="block font-(family-name:--font-display) text-6xl md:text-7xl font-black text-vc-orange leading-none"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <h3 className="mt-4 font-semibold text-xl md:text-2xl text-vc-blue-dark leading-snug">
                {step.title}
              </h3>
              <p className="mt-3 text-lg text-vc-ink/80 leading-relaxed text-justify hyphens-auto">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
