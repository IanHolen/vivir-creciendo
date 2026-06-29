"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";

// CTA flotante "Conoce nuestras membresías" (Ian 2026-06-29).
// - Aparece DESPUÉS de pasar el hero (no dentro del hero).
// - QUEDA FIJO al viewport y sigue al usuario por todas las secciones,
//   hasta cerca del footer (NO se oculta en #membresias).
// - Se renderiza por portal a <body> para que ningún ancestro con
//   transform/filter/overflow rompa el position:fixed.
// - Abajo a la derecha. Click = scroll suave a #membresias.
export default function StickyMembershipsCta() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hero = document.getElementById("quienes-somos");
    const footer = document.querySelector("footer");

    const state = { pastHero: false, footerVisible: false };
    const update = () => setShow(state.pastHero && !state.footerVisible);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) {
            // Pasamos el hero cuando su parte inferior ya quedó por encima
            // del viewport.
            state.pastHero =
              !e.isIntersecting && e.boundingClientRect.bottom <= 0;
          } else if (e.target === footer) {
            state.footerVisible = e.isIntersecting;
          }
        }
        update();
      },
      { threshold: 0 },
    );

    [hero, footer].forEach((el) => el && io.observe(el));

    // Estado inicial (por si la página ya viene scrolleada).
    if (hero) state.pastHero = hero.getBoundingClientRect().bottom <= 0;
    if (footer) {
      const fr = footer.getBoundingClientRect();
      state.footerVisible = fr.top < window.innerHeight && fr.bottom > 0;
    }
    update();

    return () => io.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("membresias")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) return null;

  return createPortal(
    <a
      href="#membresias"
      onClick={handleClick}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 right-5 z-50 inline-flex items-center justify-center gap-2 min-h-[52px] px-5 sm:px-6 py-3 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-sm sm:text-base rounded-full shadow-xl transition-all duration-300 focus-visible:ring-4 focus-visible:ring-vc-orange ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      Conoce nuestras membresías
      <ArrowRight className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
    </a>,
    document.body,
  );
}
