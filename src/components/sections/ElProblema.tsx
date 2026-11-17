import { elProblema } from "@/lib/content";

/**
 * Sección 02 — El problema (documento de las fundadoras, nov-2026).
 *
 * Va entre el hero y los beneficios. Su único trabajo es nombrar lo que la
 * persona siente pero nadie le dice; por eso es texto puro, centrado y grande,
 * sin imágenes ni botones. "FALSO" va destacado porque así viene en el
 * documento: es el giro de la sección.
 */
export default function ElProblema() {
  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div data-reveal className="max-w-[680px] mx-auto text-center space-y-6">
        {elProblema.parrafos.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? // La pregunta de apertura va en negrita (fundadoras, 17-nov-2026).
                  "text-xl md:text-2xl leading-relaxed font-bold text-vc-blue-dark text-balance"
                : "text-lg md:text-xl leading-relaxed text-vc-ink"
            }
          >
            {p}
          </p>
        ))}
        <p className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-orange-dark uppercase tracking-tight">
          {elProblema.enfasis}
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-vc-ink text-balance">
          {elProblema.cierre}
        </p>
      </div>
    </section>
  );
}
