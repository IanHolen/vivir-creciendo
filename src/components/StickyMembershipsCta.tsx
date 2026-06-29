"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

// CTA flotante "Conoce nuestras membresías" (Ian 2026-06-29).
// - Aparece DESPUÉS de pasar el hero (no dentro del hero).
// - Se oculta cuando #membresias está en viewport o al llegar al footer.
// - Abajo a la derecha para no tapar los CTAs centrales.
// - Scroll suave a #membresias.
export default function StickyMembershipsCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("quienes-somos");
    const memb = document.getElementById("membresias");
    const footer = document.querySelector("footer");

    const state = { pastHero: false, membVisible: false, footerVisible: false };
    const update = () =>
      setShow(state.pastHero && !state.membVisible && !state.footerVisible);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) {
            // "pasamos" el hero cuando ya no se ve y quedó por encima del viewport
            state.pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
          } else if (e.target === memb) {
            state.membVisible = e.isIntersecting;
          } else if (e.target === footer) {
            state.footerVisible = e.isIntersecting;
          }
        }
        update();
      },
      { threshold: 0 },
    );

    [hero, memb, footer].forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("membresias")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a
      href="#membresias"
      onClick={handleClick}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 inline-flex items-center justify-center gap-2 min-h-[52px] px-5 sm:px-6 py-3 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-sm sm:text-base rounded-full shadow-xl transition-all duration-300 focus-visible:ring-4 focus-visible:ring-vc-orange ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      Conoce nuestras membresías
      <ArrowRight className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
    </a>
  );
}
