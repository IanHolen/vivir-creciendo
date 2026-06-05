import { Calendar, Clock, Tag, Sparkles } from "lucide-react";
import {
  upcomingActivities,
  pastActivities,
  fullActivities,
} from "@/lib/content";

export default function FreeActivities({
  isLoggedIn = false,
}: {
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
              ? "Estas son las cinco actividades de nuestra comunidad. Encuentra tu lugar en cada encuentro."
              : "Más que actividades online, construimos comunidad. Encuentros para conversar, aprender y compartir desde la comodidad de tu casa, sin apuros y sin compromiso."}
          </p>
        </div>

        {isLoggedIn ? (
          /* Vista logueada — las 5 actividades completas */
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fullActivities.map((activity) => (
              <div
                key={activity.title}
                className="bg-vc-cream/40 rounded-2xl p-8 flex flex-col border border-vc-cream"
              >
                <div className="flex items-center gap-2 text-vc-orange text-sm font-medium">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{activity.cadence}</span>
                </div>
                <h3 className="mt-3 font-semibold text-2xl text-vc-blue-dark leading-snug">
                  {activity.title}
                </h3>
                <p className="mt-1 text-vc-blue text-base">
                  Con {activity.facilitator}
                </p>
                <p className="mt-3 text-lg text-vc-blue-dark/80 leading-relaxed flex-grow">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Vista deslogueada — teaser de próximas / pasadas */
          <>
            <div className="mt-12 md:mt-16">
              <h3 className="font-semibold text-2xl text-vc-blue-dark mb-8 text-center">
                Próximas actividades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {upcomingActivities.map((activity) => (
                  <div
                    key={activity.title}
                    className="bg-vc-cream/50 rounded-2xl p-8 flex flex-col border border-vc-cream"
                  >
                    <div className="flex items-center gap-2 text-vc-orange text-sm font-medium">
                      <Tag className="w-4 h-4" aria-hidden="true" />
                      <span>{activity.category}</span>
                    </div>
                    <h4 className="mt-3 font-semibold text-xl text-vc-blue-dark leading-snug">
                      {activity.title}
                    </h4>
                    <p className="mt-2 text-vc-blue-dark/70 leading-relaxed flex-grow">
                      {activity.description}
                    </p>
                    <div className="mt-4 space-y-1 text-base text-vc-blue-dark/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{activity.date}</span>
                      </div>
                      {activity.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span>{activity.time}</span>
                        </div>
                      )}
                    </div>
                    <a
                      href="#contacto"
                      className="mt-6 w-full inline-flex items-center justify-center min-h-[56px] px-6 py-4 border-2 border-vc-blue text-vc-blue hover:bg-vc-blue hover:text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
                    >
                      Quiero participar
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {pastActivities.length > 0 && (
              <div className="mt-16">
                <h3 className="font-semibold text-2xl text-vc-blue-dark/60 mb-6 text-center">
                  Actividades pasadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastActivities.map((activity) => (
                    <div
                      key={activity.title}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                    >
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{activity.category}</span>
                      </div>
                      <h4 className="mt-2 font-semibold text-lg text-vc-blue-dark/60">
                        {activity.title}
                      </h4>
                      <p className="mt-1 text-vc-blue-dark/40 text-base">
                        {activity.description}
                      </p>
                      <p className="mt-3 text-sm text-gray-400">{activity.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
