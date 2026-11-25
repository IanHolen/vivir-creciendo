import Link from "next/link";
import { Mail, ArrowRight, MessageCircle } from "lucide-react";
import { finalCta, soporte, siteConfig, whatsappHref } from "@/lib/content";
import { mailtoEscribenos } from "@/components/BotonEscribenos";

/**
 * Sección 11 — CTA final.
 *
 * Desde el 17-nov-2026 (fundadoras) el botón de cierre es "Quiero sumarme" y
 * lleva a /membresia: quien llegó hasta acá ya vio la garantía de 30 días y
 * los precios; lo que toca es suscribirse, no volver a pedir la prueba. La
 * captura de correo que había antes nunca tuvo destino real y se retiró.
 *
 * Conserva el id "contacto": el pie de página y páginas interiores enlazan
 * aquí para "Contacto", y el bloque de soporte humano sigue abajo.
 */
export default function FinalCTA() {
  const wa = whatsappHref();

  return (
    <section
      id="contacto"
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-blue noise-overlay py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div data-reveal className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight text-balance">
            {finalCta.title}
          </h2>
          <p className="mt-4 text-xl text-white/90 leading-relaxed">
            {finalCta.description}
          </p>
        </div>

        <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <Link
            href={finalCta.buttonHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[56px] px-10 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg md:text-xl rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white shadow-lg"
          >
            {finalCta.button}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <p className="mt-4 text-base text-white/70">{finalCta.note}</p>
        </div>

        {/* Soporte humano — para este target, poder escribirle a una persona
            antes de registrarse es en sí un factor de conversión. El bloque de
            WhatsApp solo aparece cuando hay número real cargado. */}
        <div className="mt-10 text-center">
          <h3 className="font-semibold text-xl text-white">{soporte.titulo}</h3>
          <div className="mt-5 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={mailtoEscribenos("Quiero saber más de Vivir Creciendo")}
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
                data-meta-lead="WhatsApp contacto"
                className="inline-flex items-center justify-center gap-3 min-h-[52px] px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:ring-4 focus-visible:ring-white text-lg"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                {soporte.whatsappLabel}
              </a>
            )}
            {siteConfig.whatsappGrupo && (
              <a
                href={siteConfig.whatsappGrupo}
                target="_blank"
                rel="noopener noreferrer"
                data-meta-lead="Grupo de WhatsApp"
                className="inline-flex items-center justify-center gap-3 min-h-[52px] px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:ring-4 focus-visible:ring-white text-lg"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                {soporte.grupoLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
