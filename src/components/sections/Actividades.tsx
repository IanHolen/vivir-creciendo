import Link from "next/link";
import {
  Film,
  Footprints,
  HeartPulse,
  DoorOpen,
  Users,
  Sparkles,
  Clock,
  Repeat,
  ArrowRight,
} from "lucide-react";
import { actividadesTitle } from "@/lib/content";
import {
  getActivities,
  normalizeIcon,
  normalizePlan,
  type ActivityIcon,
} from "@/lib/activities";

/**
 * Sección 07 — Actividades.
 *
 * UNA SOLA FUENTE DE VERDAD. Hasta acá convivían dos catálogos: este grid leía
 * un arreglo escrito a mano en content.ts, mientras que /actividades/[id] leía
 * Supabase. Eran las mismas cuatro actividades cargadas dos veces, y las
 * páginas de detalle quedaban huérfanas porque nada enlazaba a ellas.
 *
 * Ahora el grid sale de `getActivities()` (la RPC ya filtra is_active y ordena
 * por sort_order) y cada card enlaza a su ficha. Las fundadoras editan todo
 * desde /admin, sin tocar código. De content.ts solo queda el título.
 */
const ICONS: Record<ActivityIcon, typeof Film> = {
  Film,
  Footprints,
  HeartPulse,
  DoorOpen,
  Users,
  Sparkles,
};

export default async function Actividades() {
  const activities = await getActivities();
  if (activities.length === 0) return null;

  return (
    <section
      id="actividades"
      className="scroll-mt-20 md:scroll-mt-24 bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          {actividadesTitle}
        </h2>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((act) => {
            const Icon = ICONS[normalizeIcon(act.icono)];
            const gratuita = normalizePlan(act.plan) === "gratuita";
            return (
              // La card entera es el link: para 65+, un blanco de clic del
              // tamaño de la tarjeta es mucho más seguro que un "ver más".
              <Link
                key={act.id}
                href={`/actividades/${act.id}`}
                className={`group rounded-2xl p-8 flex flex-col border transition-colors hover:border-vc-blue focus-visible:ring-4 focus-visible:ring-vc-orange/50 ${
                  gratuita
                    ? "bg-vc-cream border-vc-orange/40"
                    : "bg-white border-vc-cream shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Todas las baldosas van en naranja: el ícono es decoración,
                      no jerarquía. Lo que distingue a la actividad gratuita es
                      el fondo crema de la card, el borde y el badge — no el
                      color del ícono. */}
                  <span className="w-14 h-14 shrink-0 flex items-center justify-center rounded-xl bg-vc-orange">
                    <Icon
                      className="w-7 h-7 text-white"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h3 className="font-(family-name:--font-display) text-xl md:text-2xl font-black text-vc-blue-dark uppercase tracking-tight leading-tight">
                      {act.title}
                    </h3>
                    {gratuita && (
                      <span className="mt-2 inline-block bg-vc-orange text-white text-sm font-semibold px-3 py-1 rounded-full">
                        Gratis, sin registro de tarjeta
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-5 flex-1 text-lg text-vc-ink/80 leading-relaxed">
                  {act.short_preview}
                </p>

                {(act.frecuencia || act.duracion) && (
                  <dl className="mt-6 pt-4 border-t border-vc-cream flex flex-wrap gap-x-6 gap-y-2 text-base text-vc-ink/70">
                    {act.frecuencia && (
                      <div className="flex items-center gap-2">
                        <Repeat
                          className="w-4 h-4 text-vc-orange"
                          aria-hidden="true"
                        />
                        <dt className="sr-only">Frecuencia</dt>
                        <dd>{act.frecuencia}</dd>
                      </div>
                    )}
                    {act.duracion && (
                      <div className="flex items-center gap-2">
                        <Clock
                          className="w-4 h-4 text-vc-orange"
                          aria-hidden="true"
                        />
                        <dt className="sr-only">Duración</dt>
                        <dd>{act.duracion}</dd>
                      </div>
                    )}
                  </dl>
                )}

                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-vc-blue group-hover:gap-3 transition-all">
                  Ver la actividad
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
