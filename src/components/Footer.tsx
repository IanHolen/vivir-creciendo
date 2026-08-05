import Logo from "./Logo";
import { siteConfig, navLinks, footerContent, whatsappHref } from "@/lib/content";

// Íconos de marca inline: lucide-react 1.x ya no exporta Instagram/Facebook.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// Sección 12 — Footer. Tres columnas: logo + tagline / navegación / contacto,
// con la línea legal abajo.
export default function Footer() {
  const wa = whatsappHref();

  return (
    <footer className="bg-vc-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <Logo variant="white" className="h-14 w-auto" />
            <p className="font-(family-name:--font-subtitle) text-lg italic text-white/80 text-center md:text-left">
              {footerContent.tagline}
            </p>
          </div>

          {/* Navegación */}
          <nav className="text-center md:text-left" aria-label="Navegación del pie">
            <h2 className="font-semibold text-lg mb-4">
              {footerContent.navTitle}
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
                >
                  Inicio
                </a>
              </li>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contacto"
                  className="text-white/80 hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </nav>

          {/* Contacto */}
          <div className="text-center md:text-left">
            <h2 className="font-semibold text-lg mb-4">
              {footerContent.contactTitle}
            </h2>
            <ul className="space-y-3 text-white/80">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
                >
                  {siteConfig.email}
                </a>
              </li>
              {/* PENDIENTE fundadoras: número dedicado de la comunidad. Sin
                  número no se pinta la línea — antes decía "+52 1 55 0000 0000",
                  un placeholder visible en producción. */}
              {wa && (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
                  >
                    WhatsApp: {siteConfig.whatsapp}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
                >
                  <InstagramIcon className="w-5 h-5" />
                  @vivir_creciendo
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
                >
                  <FacebookIcon className="w-5 h-5" />
                  vivircreciendo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2 text-center text-white/60 text-base">
          <span>{footerContent.legal}</span>
          <span className="hidden sm:inline" aria-hidden="true">
            |
          </span>
          {/* PENDIENTE: páginas legales reales. El doc las marca como
              requisito visible para publicar. */}
          <a
            href="#"
            className="hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
          >
            Política de Privacidad
          </a>
          <span className="hidden sm:inline" aria-hidden="true">
            |
          </span>
          <a
            href="#"
            className="hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
          >
            Términos y Condiciones
          </a>
        </div>
      </div>
    </footer>
  );
}
