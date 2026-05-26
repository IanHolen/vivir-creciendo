import { Check, Film, MessageCircle, Sparkles } from "lucide-react";
import { memberships } from "@/lib/content";

const iconMap = {
  Film,
  MessageCircle,
  Sparkles,
} as const;

export default function Memberships() {
  return (
    <section
      id="membresias"
      className="bg-vc-cream noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          NUESTRAS MEMBRESÍAS
        </h2>
        <p className="mt-4 text-center text-lg text-vc-blue-dark/70 max-w-2xl mx-auto leading-relaxed">
          Elige el espacio que más resuene contigo. Cada membresía es independiente.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((plan) => {
            const Icon = iconMap[plan.icon];
            return (
              <div
                key={plan.title}
                className={`relative bg-white rounded-2xl shadow-lg p-8 flex flex-col ${
                  plan.badge ? "ring-2 ring-vc-orange" : ""
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vc-orange text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${plan.accentBg} text-white`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className={`font-[var(--font-display)] text-xl font-black uppercase tracking-tight ${plan.accent}`}>
                    {plan.title}
                  </h3>
                </div>

                <p className="font-[var(--font-subtitle)] text-base italic text-vc-blue-dark/80 mb-3">
                  {plan.tagline}
                </p>
                <p className="text-vc-blue-dark/70 text-sm leading-relaxed mb-6">
                  {plan.description}
                </p>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        className="w-4 h-4 text-vc-orange flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-vc-blue-dark/80 text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-vc-blue-dark/50 mb-1">
                  Facilita: {plan.facilitator}
                </p>
                <p className="text-xs italic text-vc-blue-dark/40 mb-4">
                  &ldquo;{plan.closingQuote}&rdquo;
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-vc-blue-dark/50 mb-3">
                    {plan.price}
                  </p>
                  <a
                    href={`/membresias/${plan.slug}`}
                    className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-base rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
                  >
                    CONOCER MÁS
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
