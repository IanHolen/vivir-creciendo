import { Sparkles, Lock, LogIn, ArrowRight } from "lucide-react";
import { type Activity, planMeta } from "@/lib/activities";

export default function FreeActivities({
  activities,
  isLoggedIn = false,
}: {
  activities: Activity[];
  isLoggedIn?: boolean;
}) {
  return (
    <section
      id="actividades"
      className="scroll-mt-20 md:scroll-mt-24 bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark uppercase tracking-tight">
            NUESTRAS ACTIVIDADES
          </h2>
          <p className="mt-4 text-xl text-vc-blue-dark/70 leading-relaxed">
            {isLoggedIn
              ? "Estas son las actividades de nuestra comunidad. Encuentra tu lugar en cada encuentro."
              : "Más que actividades online, construimos comunidad. Mira un adelanto — inicia sesión para ver todo el detalle."}
          </p>
        </div>

        {activities.length === 0 ? (
          <p className="mt-12 text-center text-lg text-vc-blue-dark/60">
            Pronto publicaremos nuestras próximas actividades.
          </p>
        ) : (
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-vc-cream/40 rounded-2xl flex flex-col border border-vc-cream overflow-hidden"
              >
                {activity.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activity.image_url}
                    alt={activity.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-8 flex flex-col flex-grow">
                  {(() => {
                    const plan = planMeta(activity.plan);
                    return (
                      <div className="flex items-center gap-2 flex-wrap">
                        {activity.week != null && (
                          <span className="flex items-center gap-2 text-vc-orange text-sm font-medium">
                            <Sparkles className="w-4 h-4" aria-hidden="true" />
                            Semana {activity.week}
                          </span>
                        )}
                        {plan && (
                          <span
                            className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${plan.badgeClass}`}
                          >
                            {plan.label}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                  <h3 className="mt-3 font-semibold text-2xl text-vc-blue-dark leading-snug">
                    {activity.title}
                  </h3>
                  <p className="mt-3 text-lg text-vc-blue-dark/80 leading-relaxed flex-grow">
                    {activity.full_description ?? activity.short_preview}
                  </p>
                  {!activity.full_description && (
                    <p className="mt-4 flex items-center gap-2 text-base text-vc-blue-dark/60">
                      <Lock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      Detalle completo al iniciar sesión
                    </p>
                  )}
                  <a
                    href={`/actividades/${activity.id}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 border-2 border-vc-orange text-vc-orange hover:bg-vc-orange hover:text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange/40"
                  >
                    Más detalle
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoggedIn && activities.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-vc-blue-dark/70">
              Inicia sesión para ver el detalle completo de cada actividad.
            </p>
            <a
              href="/login"
              className="mt-4 inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
            >
              <LogIn className="w-5 h-5" aria-hidden="true" />
              Iniciar sesión
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
