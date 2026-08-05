import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/content";

/**
 * Botón flotante de WhatsApp — el canal preferido de este target antes que
 * un formulario (Parte XI del doc).
 *
 * Se renderiza SOLO si hay número real cargado en `siteConfig.whatsapp`.
 * Antes apuntaba a un placeholder ("+52 1 55 0000 0000"), o sea un link roto
 * visible en producción; el doc marca los links de contacto rotos como
 * bloqueante para publicar.
 *
 * También se quitó `animate-pulse`: un elemento que late permanentemente es
 * ruido visual y molesta a quien usa la página con calma.
 */
export default function WhatsAppFloat() {
  const href = whatsappHref();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
      aria-label="Escríbenos por WhatsApp"
    >
      <MessageCircle className="w-8 h-8" aria-hidden="true" />
    </a>
  );
}
