"use client";

import { useState } from "react";
import { Mail, ArrowRight, MessageCircle } from "lucide-react";
import { finalCta, soporte, siteConfig, whatsappHref } from "@/lib/content";

// Handler centralizado de la captura "Quiero mi actividad gratuita".
// PENDIENTE back: destino real del email. Por ahora se captura en el front y
// se muestra confirmación. Cuando se defina, cablear acá (un solo lugar).
async function captureSumar(email: string): Promise<void> {
  // TODO(back): enviar `email` al destino real cuando se defina.
  if (typeof console !== "undefined") {
    console.log("[actividad-gratuita] email capturado:", email);
  }
}

/**
 * Sección 11 — CTA final.
 *
 * Destino de TODOS los CTA de la página (#contacto): hero, membresías y nav
 * apuntan acá. Un solo verbo repetido en toda la landing en lugar de tres
 * botones distintos compitiendo.
 */
export default function FinalCTA() {
  const [formState, setFormState] = useState<
    "idle" | "open" | "sending" | "sent"
  >("idle");
  const [email, setEmail] = useState("");

  const wa = whatsappHref();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    await captureSumar(email);
    setFormState("sent");
    setEmail("");
  };

  return (
    <section
      id="contacto"
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-blue noise-overlay py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight text-balance">
            {finalCta.title}
          </h2>
          <p className="mt-4 text-xl text-white/90 leading-relaxed">
            {finalCta.description}
          </p>
        </div>

        <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          {formState === "sent" ? (
            <div className="text-center py-4">
              <p className="text-2xl font-semibold text-white">
                ¡Gracias! Te escribimos con los datos de la próxima actividad.
              </p>
              <button
                type="button"
                onClick={() => setFormState("idle")}
                className="mt-4 min-h-[48px] px-4 text-white underline hover:no-underline focus-visible:ring-4 focus-visible:ring-white rounded"
              >
                Sumar otro correo
              </button>
            </div>
          ) : formState === "idle" ? (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setFormState("open")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[56px] px-10 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg md:text-xl rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white shadow-lg"
              >
                {finalCta.button}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <p className="mt-4 text-base text-white/70">{finalCta.note}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label
                htmlFor="sumar-email"
                className="block text-white font-medium text-lg text-center"
              >
                Déjanos tu correo y te enviamos el link de la próxima actividad
                gratuita.
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="sumar-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="flex-1 min-h-[56px] px-4 py-3 rounded-xl bg-white text-vc-ink text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                />
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white disabled:opacity-60"
                >
                  {formState === "sending" ? "Enviando..." : "Enviar"}
                </button>
              </div>
              <p className="text-center text-base text-white/70">
                {finalCta.note}
              </p>
            </form>
          )}
        </div>

        {/* Soporte humano — para este target, poder escribirle a una persona
            antes de registrarse es en sí un factor de conversión. El bloque de
            WhatsApp solo aparece cuando hay número real cargado: un link roto
            cuesta más que la ausencia del canal. */}
        <div className="mt-10 text-center">
          <h3 className="font-semibold text-xl text-white">{soporte.titulo}</h3>
          <div className="mt-5 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center justify-center gap-3 min-h-[52px] px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:ring-4 focus-visible:ring-white text-lg"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              {soporte.emailLabel}
            </a>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 min-h-[52px] px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:ring-4 focus-visible:ring-white text-lg"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                {soporte.whatsappLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
