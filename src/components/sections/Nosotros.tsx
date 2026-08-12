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
import { getSiteMedia } from "@/lib/media-queries";

// Las 5 áreas de especialistas con su ícono (pareadas por índice con
// `expertAreas` en content.ts).
const EXPERT_AREA_ICONS = [UsersRound, Laptop, HeartPulse, Flower2, TrendingUp];

/**
 * Sección 08 — Nosotras.
 *
 * Las dos bios están reescritas (Error #5 del doc): la de Alejandra hablaba
 * de su negocio personal de nutrición ("recuperar energía", "sin dietas
 * rígidas") y no de Vivir Creciendo. Ambas cierran ahora con el mismo párrafo
 * sobre por qué crearon la comunidad.
 */
export default async function Nosotros() {
  const cofounders = teamMembers.filter((m) => m.cofounder);
  // Si subieron otra foto desde /admin/multimedia, gana esa.
  const media = await getSiteMedia();

  return (
    <section
      id="nosotras"
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-cream py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          NOSOTRAS
        </h2>
        <p className="mt-4 text-center text-lg md:text-xl text-vc-ink/80 max-w-2xl mx-auto">
          Alejandra y Nurit, cofundadoras de Vivir Creciendo.
        </p>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {cofounders.map((member) => {
            const ranura = member.mediaSlot ? media[member.mediaSlot] : undefined;
            const foto = ranura?.url ?? member.image;
            const alt = ranura?.desdeBiblioteca
              ? ranura.alt
              : `Foto de ${member.name}`;
            const encuadre = ranura?.desdeBiblioteca
              ? ""
              : (member.imagePosition ?? "");

            return (
            <div
              key={member.name}
              className="bg-white rounded-2xl p-8 shadow-sm border border-vc-cream"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-vc-cream flex items-center justify-center overflow-hidden">
                  {foto ? (
                    <Image
                      src={foto}
                      alt={alt}
                      width={128}
                      height={128}
                      className={`object-cover w-full h-full ${encuadre}`}
                    />
                  ) : (
                    <User
                      className="w-12 h-12 text-vc-orange/50"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="mt-5 font-semibold text-2xl text-vc-blue-dark">
                  {member.name}
                </h3>
                <p className="mt-1 text-base text-vc-blue">{member.role}</p>
              </div>

              {/* Las bios vienen en párrafos separados por línea en blanco.
                  Texto justificado (pedido de Ian): `hyphens-auto` es
                  necesario acá — sin partición de palabras, justificar en
                  español abre "ríos" de espacio entre palabras, y en columna
                  angosta se nota mucho. El <html lang="es"> del layout es lo
                  que habilita el diccionario de guionado. */}
              {member.bio && (
                <div className="mt-6 space-y-4 text-justify hyphens-auto">
                  {member.bio.split("\n\n").map((p, i) => (
                    <p key={i} className="text-lg text-vc-ink/80 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Especialistas — 5 categorías con ícono. */}
        <div className="mt-16 md:mt-20">
          <h3 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark text-center uppercase tracking-tight max-w-4xl mx-auto">
            {expertAreasTitle}
          </h3>
          <ul className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {expertAreas.map((area, i) => {
              const Icon = EXPERT_AREA_ICONS[i] ?? User;
              return (
                <li
                  key={area}
                  className="bg-white rounded-2xl p-6 border border-vc-cream flex flex-col items-center text-center"
                >
                  <span className="w-16 h-16 rounded-full bg-vc-orange/10 flex items-center justify-center mb-4">
                    <Icon
                      className="w-8 h-8 text-vc-orange"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                  <p className="font-semibold text-lg text-vc-ink leading-snug">
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
