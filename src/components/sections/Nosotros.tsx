import Image from "next/image";
import {
  User,
  UsersRound,
  Laptop,
  HeartPulse,
  Flower2,
  TrendingUp,
} from "lucide-react";
import { teamMembers, expertAreasTitle, expertAreas } from "@/lib/content";

// Las 5 áreas de especialistas con su ícono (pareadas por índice con
// `expertAreas` en content.ts).
const EXPERT_AREA_ICONS = [UsersRound, Laptop, HeartPulse, Flower2, TrendingUp];

export default function Nosotros() {
  const cofounders = teamMembers.filter((m) => m.cofounder);

  return (
    <section
      id="nosotros"
      className="scroll-mt-20 md:scroll-mt-24 bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          NOSOTRAS
        </h2>
        <p className="mt-4 text-center text-xl text-vc-blue-dark/70 max-w-2xl mx-auto">
          Alejandra y Nurit, cofundadoras de Vivir Creciendo.
        </p>

        {/* Cofounders — Ale + Nurit */}
        <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-8">
          {cofounders.map((member) => (
            <div
              key={member.name}
              className="bg-vc-cream/50 rounded-2xl p-8 max-w-md w-full text-center border border-vc-cream"
            >
              <div className="w-28 h-28 rounded-full mx-auto bg-vc-cream flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={`Foto de ${member.name}`}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-12 h-12 text-vc-blue/40" aria-hidden="true" />
                )}
              </div>
              <h3 className="mt-5 font-semibold text-2xl text-vc-blue-dark">
                {member.name}
              </h3>
              {member.bio ? (
                <p className="mt-4 text-lg text-vc-blue-dark/80 leading-relaxed text-left">
                  {member.bio}
                </p>
              ) : (
                <>
                  <p className="text-vc-blue text-lg">{member.role}</p>
                  {member.quote && (
                    <blockquote className="mt-4 italic text-lg text-vc-blue-dark/70 leading-relaxed">
                      &ldquo;{member.quote}&rdquo;
                    </blockquote>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Especialistas — "Nos nutrimos con expertos especialistas en"
            (Ian 2026-06-28): reemplaza la grilla de avatares por 5 categorías
            con ícono. Apila en mobile, 5 en una fila en desktop. */}
        <div className="mt-16 md:mt-20">
          <h3 className="font-[var(--font-display)] text-2xl md:text-3xl lg:text-4xl font-black text-vc-blue-dark text-center uppercase tracking-tight max-w-4xl mx-auto">
            {expertAreasTitle}
          </h3>
          <ul className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {expertAreas.map((area, i) => {
              const Icon = EXPERT_AREA_ICONS[i] ?? User;
              return (
                <li
                  key={area}
                  className="bg-vc-cream/40 rounded-2xl p-6 border border-vc-cream flex flex-col items-center text-center"
                >
                  <span className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-vc-orange" aria-hidden="true" />
                  </span>
                  <p className="font-semibold text-lg text-vc-blue-dark leading-snug">
                    {area}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
