"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Barra flotante de 3 botones (Ian 2026-06-29): Membresías · Actividades ·
// Nosotras. Reemplaza el pill suelto de 1 botón.
// - Aparece DESPUÉS de pasar el hero y SIGUE al usuario, fija abajo-centro,
//   hasta cerca del footer (NO se oculta en #membresias).
// - Render por portal a <body> para que ningún ancestro con transform/filter
//   rompa el position:fixed.
const ITEMS: { label: string; target?: string; href?: string }[] = [
  { label: "Membresías", target: "membresias" },
  { label: "Actividades", target: "actividades" },
  { label: "Nosotras", href: "/nosotros" },
];

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

    if (hero) state.pastHero = hero.getBoundingClientRect().bottom <= 0;
    if (footer) {
      const fr = footer.getBoundingClientRect();
      state.footerVisible = fr.top < window.innerHeight && fr.bottom > 0;
    }
    update();

    return () => io.disconnect();
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) return null;

  const pill =
    "inline-flex items-center justify-center min-h-[44px] px-3 sm:px-5 rounded-full bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-xs sm:text-base whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange";

  return createPortal(
    <div
      className={`fixed bottom-3 inset-x-0 z-50 flex justify-center px-3 transition-all duration-300 ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/95 backdrop-blur shadow-xl ring-1 ring-vc-blue-dark/10 p-1.5">
        {ITEMS.map((it) =>
          it.href ? (
            <a key={it.label} href={it.href} className={pill}>
              {it.label}
            </a>
          ) : (
            <a
              key={it.label}
              href={`#${it.target}`}
              onClick={scrollTo(it.target as string)}
              className={pill}
            >
              {it.label}
            </a>
          ),
        )}
      </div>
    </div>,
    document.body,
  );
}
