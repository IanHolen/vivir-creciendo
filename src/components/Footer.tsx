import { Globe, Camera, Play } from "lucide-react";
import Logo from "./Logo";
import { siteConfig, navLinks } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-vc-blue-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Logo + social */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <Logo variant="white" className="h-14 w-auto" />
            <div className="flex gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
                aria-label="Facebook"
              >
                <Globe className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
                aria-label="Instagram"
              >
                <Camera className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
                aria-label="YouTube"
              >
                <Play className="w-5 h-5" aria-hidden="true" />
              </a>
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
