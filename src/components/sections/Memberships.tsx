import { Check, Star } from "lucide-react";
import { membershipInfo } from "@/lib/content";

export default function Memberships() {
  return (
    <section id="membresias" className="bg-vc-cream noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark uppercase tracking-tight">
          {membershipInfo.title}
        </h2>
        <p className="mt-4 font-[var(--font-subtitle)] text-xl text-vc-blue uppercase italic">
          {membershipInfo.subtitle}
        </p>
        <p className="mt-6 text-lg text-vc-blue-dark/70 leading-relaxed">
          {membershipInfo.description}
        </p>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 text-left">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-7 h-7 text-vc-orange" aria-hidden="true" />
            <h3 className="font-semibold text-2xl text-vc-blue-dark">
              Membresía Vivir Creciendo
            </h3>
          </div>
          <ul className="space-y-3">
            {membershipInfo.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-vc-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-vc-blue-dark/80 text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-vc-blue-dark/50 mb-4">{membershipInfo.price}</p>
            <a
              href="#contacto"
              className="w-full inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
            >
              {membershipInfo.cta}
            </a>
            <p className="mt-4 text-sm text-vc-blue-dark/50">
              {membershipInfo.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
