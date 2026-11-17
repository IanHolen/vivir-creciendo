"use client";

import { useEffect } from "react";

/**
 * Aparición progresiva al hacer scroll (fundadoras, 17-nov-2026: "que no se
 * vea tan estático").
 *
 * Cualquier elemento con `data-reveal` arranca un poco más abajo y
 * transparente, y al entrar en pantalla recibe `is-visible` (ver globals.css).
 * `data-reveal-delay="2"` escalona hijos de una misma fila.
 *
 * Reglas para este público:
 *   · Solo opacidad y 16 px de desplazamiento, 600 ms: se nota, no marea.
 *   · Con `prefers-reduced-motion` el CSS lo muestra todo de una, sin mover.
 *   · Sin JavaScript (o si tarda), el CSS también lo deja visible: la clase
 *     `js` en <html> es lo que habilita el estado inicial oculto.
 *   · Cada elemento se anima una sola vez; al volver a subir no se esconde.
 */
export default function Revelar() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodos = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduce || !("IntersectionObserver" in window)) {
      nodos.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    nodos.forEach((n) => io.observe(n));

    // Lo que ya está en pantalla al cargar (el hero) no debe esperar al scroll.
    requestAnimationFrame(() => {
      nodos.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) n.classList.add("is-visible");
      });
    });

    return () => io.disconnect();
  }, []);

  return null;
}
