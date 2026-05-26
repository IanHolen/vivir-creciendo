import { Film, MessageCircle, Sparkles, Check } from "lucide-react";
import { memberships, membershipsDisclaimer } from "@/lib/content";

const iconMap = {
  Film,
  MessageCircle,
  Sparkles,
} as const;

export default function Memberships() {
  return (
    <section id="membresias" className="bg-vc-cream noise-overlay py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark uppercase tracking-tight">
            ELIGE TU MEMBRESÍA
          </h2>
          <p className="mt-4 font-[var(--font-subtitle)] text-xl text-vc-blue uppercase italic">
            Tres formas de vivir creciendo, todas en comunidad
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {memberships.map((m) => {
            const Icon = iconMap[m.icon];
            return (
              <div
                key={m.title}
                className="relative bg-white rounded-2xl shadow-lg p-8 flex flex-col border border-gray-100"
              >
                {m.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-vc-orange text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                    {m.badge}
                  </div>
                )}
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${m.accentBg}/10`}>
                  <Icon className={`w-7 h-7 ${m.accent}`} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase">
                  {m.title}
                </h3>
                <p className="mt-3 text-vc-blue-dark/70 leading-relaxed flex-grow">
                  {m.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {m.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-vc-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-vc-blue-dark/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-vc-blue-dark/50">{m.price}</p>
                  <a
                    href="#contacto"
                    className="mt-4 w-full inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
                  >
                    QUIERO ESTE PLAN
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-vc-blue-dark/60 max-w-3xl mx-auto leading-relaxed">
          {membershipsDisclaimer}
        </p>
      </div>
    </section>
  );
}
