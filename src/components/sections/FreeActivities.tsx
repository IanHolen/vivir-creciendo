import { Sparkles, Lock, LogIn } from "lucide-react";
import { fullActivities } from "@/lib/content";

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
              : "Más que actividades online, construimos comunidad. Estas son nuestras cinco actividades — inicia sesión para ver todo el detalle."}
          </p>
        </div>

        {/* Las 5 actividades del programa. Gateadas por sesión:
            deslogueado = title + adelanto corto; logueado = descripción completa. */}
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
                {isLoggedIn ? activity.description : activity.preview}
              </p>
              {!isLoggedIn && (
                <p className="mt-4 flex items-center gap-2 text-base text-vc-blue-dark/60">
                  <Lock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  Detalle completo al iniciar sesión
                </p>
              )}
            </div>
          ))}
        </div>

        {!isLoggedIn && (
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
