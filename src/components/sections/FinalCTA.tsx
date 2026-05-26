"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { siteConfig, finalCta } from "@/lib/content";

export default function FinalCTA() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    // PLACEHOLDER: integrate with backend
    setTimeout(() => {
      setFormState("sent");
      setForm({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <section id="contacto" className="bg-vc-orange noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            {finalCta.title}
          </h2>
          <p className="mt-4 text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {finalCta.description}
          </p>
          <a
            href="#membresias"
            className="mt-8 inline-flex items-center justify-center min-h-[56px] px-10 py-4 bg-white text-vc-orange hover:bg-vc-cream font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white shadow-lg"
          >
            {finalCta.button}
          </a>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="font-semibold text-2xl text-white text-center mb-6">
              Soporte humano
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 text-white/90">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span>WhatsApp: {siteConfig.whatsapp}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-white rounded"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>

            {formState === "sent" ? (
              <div className="text-center py-8">
                <p className="text-2xl font-semibold text-white">
                  Mensaje enviado
                </p>
                <p className="mt-2 text-white/80 text-lg">
                  Te responderemos pronto. Gracias por contactarnos.
                </p>
                <button
                  onClick={() => setFormState("idle")}
                  className="mt-4 text-white underline hover:no-underline focus-visible:ring-4 focus-visible:ring-white rounded"
                  type="button"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-white/90 font-medium mb-1">
                    Nombre
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/90 text-vc-blue-dark text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-white/90 font-medium mb-1">
                    Correo electrónico
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/90 text-vc-blue-dark text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-white/90 font-medium mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 text-vc-blue-dark text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white resize-y"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="w-full min-h-[56px] px-8 py-4 bg-white text-vc-orange hover:bg-vc-cream font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white disabled:opacity-60"
                >
                  {formState === "sending" ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
