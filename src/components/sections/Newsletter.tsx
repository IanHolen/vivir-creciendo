"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { newsletterContent } from "@/lib/content";

export default function Newsletter() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setFormState("sending");
    // PLACEHOLDER: integrate with backend
    setTimeout(() => {
      setFormState("sent");
      setEmail("");
      setWhatsapp("");
      setConsent(false);
    }, 1000);
  };

  return (
    <section className="bg-vc-cream py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
          {newsletterContent.title}
        </h2>
        <p className="mt-3 text-lg text-vc-blue-dark/70">
          {newsletterContent.description}
        </p>

        {formState === "sent" ? (
          <div className="mt-8 py-6">
            <p className="text-2xl font-semibold text-vc-blue-dark">
              ¡Gracias por suscribirte!
            </p>
            <p className="mt-2 text-vc-blue-dark/70 text-lg">
              Pronto recibirás noticias de nuestra comunidad.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
            <div>
              <label htmlFor="newsletter-email" className="block text-vc-blue-dark font-medium mb-1">
                <Mail className="inline w-4 h-4 mr-2" aria-hidden="true" />
                Correo electrónico
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-gray-200 bg-white text-vc-blue-dark text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label htmlFor="newsletter-whatsapp" className="block text-vc-blue-dark font-medium mb-1">
                <Phone className="inline w-4 h-4 mr-2" aria-hidden="true" />
                WhatsApp
              </label>
              <input
                id="newsletter-whatsapp"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-gray-200 bg-white text-vc-blue-dark text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange"
                placeholder="+52 1 55 1234 5678"
              />
            </div>
            <div className="flex items-start gap-3 pt-2">
              <input
                id="newsletter-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 accent-vc-orange focus-visible:ring-4 focus-visible:ring-vc-orange"
                required
              />
              <label htmlFor="newsletter-consent" className="text-base text-vc-blue-dark/70">
                {newsletterContent.consent}
              </label>
            </div>
            <button
              type="submit"
              disabled={formState === "sending" || !consent}
              className="w-full min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange disabled:opacity-60"
            >
              {formState === "sending" ? "Enviando..." : "SUSCRIBIRME"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
