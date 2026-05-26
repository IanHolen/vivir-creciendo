import { Users, BookOpen, Heart } from "lucide-react";
import { pillars } from "@/lib/content";

const iconMap = {
  Users,
  BookOpen,
  Heart,
} as const;

export default function Pillars() {
  return (
    <section className="bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          NUESTROS PILARES
        </h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon];
            return (
              <div key={pillar.title} className="text-center">
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-vc-cream">
                  <Icon className="w-10 h-10 text-vc-blue" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-lg text-vc-blue-dark/70 leading-relaxed">
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
