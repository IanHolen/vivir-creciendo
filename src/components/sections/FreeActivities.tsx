"use client";

import { Calendar } from "lucide-react";
import { freeActivities } from "@/lib/content";

export default function FreeActivities() {
  return (
    <section id="actividades" className="bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark uppercase tracking-tight">
            PARTICIPA GRATIS
          </h2>
          <p className="mt-4 text-xl text-vc-blue-dark/70">
            Conoce nuestra comunidad antes de unirte
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {freeActivities.map((activity) => (
            <div
              key={activity.title}
              className="bg-vc-cream/50 rounded-2xl p-8 flex flex-col border border-vc-cream"
            >
              <div className="flex items-center gap-3 text-vc-blue">
                <Calendar className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{activity.date}</span>
              </div>
              <h3 className="mt-4 font-semibold text-xl text-vc-blue-dark">
                {activity.title}
              </h3>
              <p className="mt-2 text-vc-blue-dark/70 leading-relaxed flex-grow">
                {activity.description}
              </p>
              <a
                href="#contacto"
                className="mt-6 w-full inline-flex items-center justify-center min-h-[56px] px-6 py-4 bg-vc-blue hover:bg-vc-blue-dark text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
              >
                RESERVAR MI LUGAR
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
