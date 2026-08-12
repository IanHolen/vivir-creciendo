import { HeartHandshake, Lightbulb, Users } from "lucide-react";
import {
  pillars,
  pillarsTitle,
  pillarsIntro,
  memberCountLine,
} from "@/lib/content";

// Sección 04 — ¿Qué es Vivir Creciendo? Tres columnas: ícono outline en azul
// marca + título + descripción. Stack vertical en mobile.
const iconMap = { HeartHandshake, Lightbulb, Users } as const;

export default function Pillars() {
  const miembros = memberCountLine();

  return (
    <section className="bg-vc-cream py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          {pillarsTitle}
        </h2>
        <p className="mt-4 text-center text-lg md:text-xl text-vc-ink/80 max-w-2xl mx-auto">
          {pillarsIntro}
        </p>
        {/* La cifra repite la del hero a propósito (Ian 2026-08-12): acá el
            visitante ya entendió qué es la comunidad, y el número contesta la
            pregunta que sigue — "¿hay gente adentro?". Va como chip y no como
            otro párrafo para que no se lea como una tercera línea de la
            bajada. */}
        {miembros && (
          <p className="mt-5 flex justify-center">
            <span className="inline-block rounded-full bg-vc-orange/10 px-5 py-2 text-base md:text-lg font-semibold text-vc-orange-dark">
              {miembros}
            </span>
          </p>
        )}

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon];
            return (
              <div key={pillar.title} className="text-center">
                {/* Ícono naranja sobre chip del mismo naranja al 10%: funciona
                    igual sobre crema que sobre blanco, y evita el chip crema
                    invisible ahora que la sección es crema. */}
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-vc-orange/10">
                  <Icon
                    className="w-10 h-10 text-vc-orange"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-6 font-(family-name:--font-display) text-xl md:text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-lg text-vc-ink/80 leading-relaxed text-justify hyphens-auto">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
