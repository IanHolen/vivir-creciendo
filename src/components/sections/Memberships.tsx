import { Check, ArrowRight, CalendarCheck } from "lucide-react";
import {
  membershipPlans,
  membershipsTitle,
  membershipsSubtitle,
  cancelacion,
} from "@/lib/content";

/**
 * Sección 09 — Membresías.
 *
 * Dos cambios de fondo respecto de la versión anterior:
 *
 * 1. UNA SOLA MEMBRESÍA. Los tres planes (Gratis / Básica / Plus) se
 *    colapsaron en Gratuita + Membresía.
 * 2. PRECIOS SIEMPRE VISIBLES (Error #1 del doc, el más grave). Antes el
 *    precio decía "Precio por confirmar" y encima solo se renderizaba si el
 *    visitante estaba logueado — justo al revés de lo que hace falta: quien
 *    todavía no se registró es precisamente quien necesita ver el número
 *    para decidir. Este componente ya no depende del estado de sesión.
 */
export default function Memberships() {
  return (
    // Sección destacada, igual que testimonios: tinte suave del azul de marca
    // (el doc pide "teal claro" para las secciones de membresías y testimonios).
    <section
      id="membresias"
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-blue-soft py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          {membershipsTitle}
        </h2>
        <p className="mt-4 text-center text-lg md:text-xl text-vc-ink/80 max-w-2xl mx-auto leading-relaxed">
          {membershipsSubtitle}
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {membershipPlans.map((plan) => (
            <div
              key={plan.name}
              // Las cards ya no se recortan contra un fondo crema: sobre
              // blanco necesitan borde propio, no solo sombra.
              className={`relative bg-white rounded-2xl p-8 flex flex-col ${
                plan.featured
                  ? "shadow-xl ring-2 ring-vc-orange md:-translate-y-2"
                  : "shadow-lg border border-vc-cream"
              }`}
            >
              <h3 className="font-(family-name:--font-display) text-2xl font-black uppercase tracking-tight text-vc-blue-dark">
                {plan.name}
              </h3>

              {/* El precio es lo primero después del nombre — no se esconde
                  al final de la tarjeta ni detrás de un "escríbenos". */}
              <p className="mt-4 font-(family-name:--font-display) text-4xl font-black text-vc-blue-dark">
                {plan.price}
              </p>
              <p className="mt-1 text-base text-vc-ink/70">{plan.priceNote}</p>

              <p className="mt-5 font-(family-name:--font-subtitle) text-lg italic text-vc-ink/90">
                {plan.tagline}
              </p>

              <ul className="mt-6 space-y-4 flex-1">
                {plan.features.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 text-vc-orange-dark shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span className="text-lg text-vc-ink/90 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.reassurance && (
                <p className="mt-6 text-base font-medium text-vc-ink/70">
                  {plan.reassurance}
                </p>
              )}

              <a
                href={plan.ctaHref}
                // Los dos botones en terracota (Ian, 20-ago-2026). La
                // diferencia entre el plan gratis y el de pago la marca el
                // relleno, no el color: contorneado el primero, lleno el
                // segundo. El contorno usa el naranja oscuro porque el de
                // marca, como texto sobre blanco, no llega a AA.
                className={`mt-6 w-full inline-flex items-center justify-center gap-2 min-h-[56px] px-6 py-4 font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 ${
                  plan.kind === "gratis"
                    ? "border-2 border-vc-orange-dark text-vc-orange-dark hover:bg-vc-orange-dark hover:text-white"
                    : "bg-vc-orange hover:bg-vc-orange-light text-white shadow-lg"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>

        {/* Cómo funciona la cancelación — va justo debajo de las membresías
            porque su trabajo es desactivar el riesgo percibido en el momento
            exacto en que el visitante está mirando el precio. Antes había acá
            una garantía de devolución a los 7 días; se reemplazó por la
            explicación de la baja (Ian 2026-08-12). */}
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-vc-blue/15">
          <div className="flex items-start gap-4">
            <CalendarCheck
              className="w-8 h-8 text-vc-orange shrink-0"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-xl text-vc-blue-dark">
                {cancelacion.title}
              </h3>
              <p className="mt-3 text-lg text-vc-ink/80 leading-relaxed text-justify hyphens-auto">
                {cancelacion.text}
              </p>
              <p className="mt-3 text-lg text-vc-ink/80 leading-relaxed text-justify hyphens-auto">
                {cancelacion.closing}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
