import {
  Award,
  MessagesSquare,
  HeartHandshake,
  Video,
  CalendarCheck,
  UserCheck,
} from "lucide-react";
import { beneficios, beneficiosTitle, memberCountLine } from "@/lib/content";

/**
 * Sección 03 — Qué vas a ganar acá (documento de las fundadoras, nov-2026).
 *
 * Seis beneficios escritos como lo que gana la persona, no como lo que hace
 * la comunidad. Reemplaza a las tres columnas de "¿Qué es Vivir Creciendo?".
 * Dos columnas en tablet, tres en escritorio: seis tarjetas en una sola
 * columna hacían la sección demasiado larga para un público que lee despacio.
 */
const iconMap = {
  Award,
  MessagesSquare,
  HeartHandshake,
  Video,
  CalendarCheck,
  UserCheck,
} as const;

export default function Beneficios() {
  const miembros = memberCountLine();

  return (
    <section className="bg-vc-cream py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          {beneficiosTitle}
        </h2>
        {miembros && (
          <p className="mt-5 flex justify-center">
            <span className="inline-block rounded-full bg-vc-orange/10 px-5 py-2 text-base md:text-lg font-semibold text-vc-orange-dark">
              {miembros}
            </span>
          </p>
        )}

        <ul className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {beneficios.map((b) => {
            const Icon = iconMap[b.icon];
            return (
              <li
                key={b.title}
                className="bg-white rounded-2xl p-7 border border-vc-cream shadow-sm flex gap-4"
              >
                <span className="shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl bg-vc-orange/10">
                  <Icon
                    className="w-7 h-7 text-vc-orange"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="font-semibold text-xl text-vc-blue-dark leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-lg text-vc-ink/80 leading-relaxed">
                    {b.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
