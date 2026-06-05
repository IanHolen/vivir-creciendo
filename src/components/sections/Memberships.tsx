import { Check, Gift, Plus } from "lucide-react";
import { membershipTiers } from "@/lib/content";

export default function Memberships({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  return (
    <section
      id="membresias"
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-cream noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          NUESTRAS MEMBRESÍAS
        </h2>
        <p className="mt-4 text-center text-lg md:text-xl text-vc-blue-dark/70 max-w-2xl mx-auto leading-relaxed">
          {isLoggedIn
            ? "Tu comunidad, en el plan que elijas. Mirá todo lo que incluye cada membresía."
            : "Elegí cuánto querés acompañarte de la comunidad. Empezá por lo gratuito y sumá actividades cuando tengas ganas."}
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {membershipTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-lg p-8 flex flex-col ${
                tier.featured ? "ring-2 ring-vc-orange md:-translate-y-2" : ""
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vc-orange text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
                  {tier.badge}
                </span>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-11 h-11 flex items-center justify-center rounded-full text-white ${
                    tier.kind === "gratis" ? "bg-vc-blue" : "bg-vc-orange"
                  }`}
                >
                  {tier.kind === "gratis" ? (
                    <Gift className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Plus className="w-6 h-6" aria-hidden="true" />
                  )}
                </div>
                <h3 className="font-[var(--font-display)] text-2xl font-black uppercase tracking-tight text-vc-blue-dark">
                  {tier.name}
                </h3>
              </div>

              <p className="font-[var(--font-subtitle)] text-base italic text-vc-blue-dark/80 mb-4">
                {tier.tagline}
              </p>

              {isLoggedIn && (
                <p className="text-base text-vc-blue-dark/70 leading-relaxed mb-6">
                  {tier.fullDescription}
                </p>
              )}

              <ul className="space-y-3 mb-6 flex-1">
                {tier.activities.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 text-vc-orange flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-vc-blue-dark/90 text-lg leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
                {tier.extras.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-vc-blue-dark/60"
                  >
                    <Plus
                      className="w-5 h-5 text-vc-blue flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-base leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              {isLoggedIn && (
                <p className="mt-auto pt-2 mb-3 text-center text-lg font-semibold text-vc-blue-dark">
                  {tier.priceLabel}
                </p>
              )}

              <a
                href="#contacto"
                className={`${isLoggedIn ? "" : "mt-auto"} w-full inline-flex items-center justify-center min-h-[56px] px-6 py-4 font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange ${
                  tier.kind === "gratis"
                    ? "border-2 border-vc-blue text-vc-blue hover:bg-vc-blue hover:text-white"
                    : "bg-vc-orange hover:bg-vc-orange-light text-white"
                }`}
              >
                {tier.kind === "gratis" ? "Quiero probar gratis" : "Quiero sumarme"}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-base text-vc-blue-dark/60">
          Escribinos y te contamos los detalles. Sin apuros.
        </p>
      </div>
    </section>
  );
}
