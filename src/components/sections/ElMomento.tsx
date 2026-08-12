import { elMomento } from "@/lib/content";

/**
 * Sección 03 — El Momento.
 *
 * Sin título visible y sin imágenes, a propósito: es texto puro cuyo único
 * trabajo es la resonancia emocional ("me están leyendo la mente"). Ancho
 * acotado y cuerpo grande porque el target tiene mayor prevalencia de
 * presbicia — el doc fija 18-20px como piso para este bloque.
 */
export default function ElMomento() {
  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[680px] mx-auto text-center space-y-6">
        {elMomento.map((p, i) => (
          <p
            key={i}
            // El primer párrafo es el gancho y funciona como subtítulo: queda
            // centrado y equilibrado. Los dos siguientes son prosa y van
            // justificados (Ian 2026-08-12).
            className={
              i === 0
                ? "text-xl md:text-2xl leading-relaxed font-medium text-vc-blue-dark text-balance"
                : "text-lg md:text-xl leading-relaxed text-vc-ink text-justify hyphens-auto"
            }
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
