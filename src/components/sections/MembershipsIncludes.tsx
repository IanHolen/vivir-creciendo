import { Check, Plus } from "lucide-react";
import { membershipIncludes } from "@/lib/content";

// Bloque "¿Qué incluyen las Membresías?" — coexiste DEBAJO del bloque de
// precios (Memberships, #membresias). Decisión Ian B_coexistir (2026-06-28):
// no reemplaza nada. Sin precios y sin botón propio; el CTA 'Quiero sumarme'
// vive en el bloque de precios / otra task. Ancla propia para no chocar con
// #membresias (que debe seguir apuntando al bloque de precios).
export default function MembershipsIncludes() {
  const { title, esencial, plus } = membershipIncludes;

  return (
    <section
      id="que-incluyen-membresias"
      className="scroll-mt-20 md:scroll-mt-24 bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          {title}
        </h2>

        {/* 2 tarjetas: Esencial · Plus. Apiladas en mobile, lado a lado en md+. */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Esencial */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
            <h3 className="font-[var(--font-display)] text-2xl font-black uppercase tracking-tight text-vc-blue-dark">
              {esencial.titulo}
            </h3>
            <ul className="mt-6 space-y-5">
              {esencial.items.map((item) => (
                <li key={item.k} className="flex items-start gap-3">
                  <Check
                    className="w-5 h-5 text-vc-orange flex-shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block font-semibold text-lg text-vc-blue-dark leading-snug">
                      {item.k}
                    </span>
                    <span className="block mt-1 text-base text-vc-blue-dark/70 leading-relaxed">
                      {item.v}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plus — destacada (incluye todo lo esencial + extras). */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col ring-2 ring-vc-orange">
            <h3 className="font-[var(--font-display)] text-2xl font-black uppercase tracking-tight text-vc-blue-dark">
              {plus.titulo}
            </h3>
            <p className="mt-2 font-[var(--font-subtitle)] text-base italic text-vc-blue-dark/80">
              {plus.encabezado}
            </p>
            <ul className="mt-6 space-y-5">
              {plus.items.map((item) => (
                <li key={item.k} className="flex items-start gap-3">
                  <Plus
                    className="w-5 h-5 text-vc-blue flex-shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block font-semibold text-lg text-vc-blue-dark leading-snug">
                      {item.k}
                    </span>
                    <span className="block mt-1 text-base text-vc-blue-dark/70 leading-relaxed">
                      {item.v}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
