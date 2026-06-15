import Logo from "./Logo";
import { siteConfig, navLinks } from "@/lib/content";

// Ícono de Instagram inline: lucide-react 1.x ya no exporta íconos de marca
// (Instagram/Facebook/YouTube fueron removidos), así que lo dibujamos a mano.
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

export default function Footer() {
  return (
    <footer className="bg-vc-blue-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Logo + social */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <Logo variant="white" className="h-14 w-auto" />
            <div className="flex flex-col items-center md:items-start gap-2">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 min-h-[48px] px-5 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
                aria-label="Síguenos en Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
                <span className="font-medium">Síguenos en Instagram</span>
              </a>
              <span className="text-white/70 text-sm">
                Encuéntranos como @vivir_creciendo
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Navegación</h3>
            <ul className="space-y-3">
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
            </ul>
          </div>

          {/* Contact + legal */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-white/80">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>WhatsApp: {siteConfig.whatsapp}</li>
            </ul>
            <div className="mt-6 space-y-2 text-white/60 text-sm">
              <a href="#" className="block hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1">
                Política de privacidad
              </a>
              <a href="#" className="block hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-1">
                Términos y condiciones
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          &copy; 2026 Vivir Creciendo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
