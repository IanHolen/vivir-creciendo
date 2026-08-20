"use client";

import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import Logo from "./Logo";
import { navLinks, navCta } from "@/lib/content";
import { logout } from "@/lib/auth-actions";

/**
 * Sección 00 — Nav.
 *
 * Barra AZUL MARINO con logo blanco, como vivircreciendo.com. Antes era blanca
 * con links azules; el cambio de paleta (azul marino principal) mueve el nav a
 * fondo azul y deja al naranja como único acento posible sobre ese fondo — por
 * eso el CTA sigue siendo naranja acá aunque en el cuerpo de la página los
 * botones principales pasaron a azul: sobre azul, un botón azul no existe.
 *
 * Contraste: blanco sobre #142B71 da ~13:1, muy por encima del 4.5:1 de AA.
 */
/**
 * CTA del nav. Crece de `sm` para arriba y no antes: en un teléfono de 390px
 * conviven logo + este botón + el menú hamburguesa en la misma fila, y a 18px
 * con px-6 el botón desborda y tapa la hamburguesa.
 */
const navCtaClass =
  "inline-flex items-center justify-center whitespace-nowrap min-h-[48px] px-4 py-2.5 sm:px-6 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-base sm:text-lg rounded-lg transition-colors focus-visible:ring-4 focus-visible:ring-white/70";

/**
 * Link de texto sobre la barra azul.
 *
 * TAMAÑO (Ian 2026-08-19): 18px desde `lg` y 20px desde `xl`. Antes eran 16px,
 * o sea MÁS CHICOS que el cuerpo de la página, que está en 18px — al revés de
 * lo que corresponde para este público. El salto a 20px se reserva para `xl`
 * porque entre 1024 y 1280px conviven hasta cinco elementos (los tres links,
 * el saludo y "Cerrar sesión") y a 20px se desbordarían.
 *
 * El hover aclara, no cambia de color: un naranja de texto sobre azul marino
 * baja a ~3:1 y no llega a AA.
 */
const navLinkClass =
  "text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors font-medium text-lg xl:text-xl whitespace-nowrap focus-visible:ring-4 focus-visible:ring-white/70 rounded-lg px-2 py-1";

export default function Navbar({
  isLoggedIn = false,
  userName = null,
}: {
  isLoggedIn?: boolean;
  userName?: string | null;
}) {
  const [open, setOpen] = useState(false);

  const loginControl = isLoggedIn ? (
    <div className="flex items-center gap-3">
      {/* El saludo es el elemento de ancho impredecible de la barra: con los
          links a 18-20px y cinco elementos en fila, un nombre largo la
          desborda entre 1024 y 1280px. Dos frenos:
            · debajo de xl no se muestra el nombre, solo "Mi perfil";
            · de xl para arriba el nombre va recortado con puntos suspensivos,
              así que ningún nombre, por largo que sea, rompe la barra.
          El `aria-label` conserva el nombre completo para quien usa lector de
          pantalla, aunque en pantalla aparezca cortado. */}
      <a
        href="/perfil"
        className={`min-h-[44px] inline-flex items-center ${navLinkClass}`}
        aria-label={userName ? `Ir a mi perfil, ${userName}` : "Ir a mi perfil"}
      >
        {userName ? (
          <>
            <span className="xl:hidden">Mi perfil</span>
            <span className="hidden xl:inline-block max-w-[14rem] truncate">
              Hola, {userName}
            </span>
          </>
        ) : (
          "Mi perfil"
        )}
      </a>
      <form action={logout}>
        <button
          type="submit"
          className={`min-h-[44px] px-4 py-2 ${navLinkClass}`}
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  ) : (
    // "Iniciar sesión" baja a link de texto: el único botón naranja del nav
    // es "Prueba gratis". Dos botones del mismo color compiten entre sí y
    // el que gana debería ser siempre el de alta.
    <a
      href="/login"
      className={`inline-flex items-center gap-2 min-h-[44px] ${navLinkClass}`}
    >
      <LogIn className="w-5 h-5" aria-hidden="true" />
      Iniciar sesión
    </a>
  );

  return (
    <nav
      className="sticky top-0 z-40 bg-vc-blue text-white shadow-sm"
      aria-label="Navegación principal"
    >
      {/* Barra más alta (Ian 2026-08-19): 80px en mobile, 96px de md para
          arriba. De paso queda igualada con el `scroll-mt-20 md:scroll-mt-24`
          que ya traían las secciones ancladas, que estaba calculado para esa
          altura y sobraba unos píxeles. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 md:h-24">
        <a
          href="#"
          className="shrink-0 focus-visible:ring-4 focus-visible:ring-white/70 rounded-lg"
        >
          {/* 72px en desktop, contra los 56 de antes. El lockup es 1080x461,
              así que a 72px de alto mide ~169px de ancho y deja 12px de aire
              arriba y abajo dentro de la barra de 96px.
              En teléfonos angostos baja: el logo comparte fila con el botón
              naranja y la hamburguesa. A 320px (el iPhone SE viejo) los tres
              solo entran con el logo en 40px — a 48px el botón se partía en
              dos líneas y pisaba el logo, cosa que ya venía pasando. */}
          <Logo
            variant="white"
            className="h-10 w-auto min-[360px]:h-12 sm:h-14 md:h-[4.5rem]"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={navLinkClass}>
              {link.label}
            </a>
          ))}
          {loginControl}
          {!isLoggedIn && (
            <a href={navCta.href} className={navCtaClass}>
              {navCta.label}
            </a>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          {!isLoggedIn && (
            <a href={navCta.href} className={navCtaClass}>
              {navCta.label}
            </a>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors focus-visible:ring-4 focus-visible:ring-white/70"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            type="button"
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — mismo azul que la barra, para que se lea como una sola
          superficie desplegada y no como un panel ajeno. */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-20 md:top-24 bg-vc-blue z-30 flex flex-col items-center justify-center gap-8 p-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-semibold text-white hover:underline underline-offset-4 transition-colors focus-visible:ring-4 focus-visible:ring-white/70 rounded-lg px-4 py-2"
            >
              {link.label}
            </a>
          ))}
          {!isLoggedIn && (
            <a
              href={navCta.href}
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-xl rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white/70"
            >
              {navCta.label}
            </a>
          )}
          {/* login/logout navegan (a /login o redirect a /), así que el menú
              se reinicia solo en la nueva página — sin onClick setOpen que
              desmonte el form de logout antes de enviarse. */}
          <div className="mt-4">{loginControl}</div>
        </div>
      )}
    </nav>
  );
}
