"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { finalCta, soporte } from "@/lib/content";

// Handler centralizado de la captura "Quiero sumarme".
// PENDIENTE Ian: destino del mail. Por ahora se captura en el front y se
// muestra confirmación; NO hace falta backend. Cuando Ian confirme el destino,
// cablear acá (un solo lugar) — coordinar con back.
async function captureSumar(email: string): Promise<void> {
  // TODO(back): enviar `email` al destino real cuando se defina.
  if (typeof console !== "undefined") {
    console.log("[quiero-sumarme] email capturado:", email);
  }
}

export default function FinalCTA() {
  const [formState, setFormState] = useState<
    "idle" | "open" | "sending" | "sent"
  >("idle");
  const [email, setEmail] = useState("");

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
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-orange noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            {finalCta.title}
          </h2>
          <p className="mt-4 text-xl text-white/90 leading-relaxed text-justify hyphens-auto sm:text-center">
            {finalCta.description}
          </p>
        </div>

        {/* Quiero sumarme — captura de email (P1). Paso 1: botón. Paso 2:
            mini-form que pide el correo. Al enviar: confirmación. */}
        <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          {formState === "sent" ? (
            <div className="text-center py-4">
              <p className="text-2xl font-semibold text-white">
                ¡Gracias! Te vamos a contactar.
              </p>
              <button
                type="button"
                onClick={() => setFormState("idle")}
                className="mt-4 text-white underline hover:no-underline focus-visible:ring-4 focus-visible:ring-white rounded"
              >
                Sumar otro correo
              </button>
            </div>
          ) : formState === "idle" ? (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setFormState("open")}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[56px] px-10 py-4 bg-white text-vc-orange hover:bg-vc-cream font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white shadow-lg"
              >
                Quiero sumarme
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label
                htmlFor="sumar-email"
                className="block text-white font-medium text-lg text-center"
              >
                Déjanos tu correo y nos ponemos en contacto.
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
                  className="flex-1 min-h-[56px] px-4 py-3 rounded-xl bg-white/95 text-vc-blue-dark text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                />
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="min-h-[56px] px-8 py-4 bg-white text-vc-orange hover:bg-vc-cream font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white disabled:opacity-60"
                >
                  {formState === "sending" ? "Enviando..." : "Quiero sumarme"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Soporte humano (P2) — placeholders hasta que Ian pase los datos. */}
        <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="font-semibold text-2xl text-white text-center">
            {soporte.titulo}
          </h3>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center text-white/90">
            <a
              href={soporte.emailHref}
              className="flex items-center justify-center gap-3 min-h-[52px] px-6 rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus-visible:ring-4 focus-visible:ring-white text-lg"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              {soporte.emailLabel}
            </a>
            <a
              href={soporte.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 min-h-[52px] px-6 rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus-visible:ring-4 focus-visible:ring-white text-lg"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              {soporte.whatsappLabel} — {soporte.whatsappText}
            </a>
          </div>
          <p className="mt-4 text-center text-sm text-white/60">
            Datos de contacto próximamente.
          </p>
        </div>
      </div>
    </section>
  );
}
