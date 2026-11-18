"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Voz } from "@/lib/testimonios";

/**
 * Carrusel de "Voces de la comunidad" (punto 9 de la lista de Ian).
 *
 * Está construido sobre scroll nativo con `scroll-snap` y no sobre un track
 * con `transform`, por tres motivos que importan con este público:
 *
 *   1. Cuántas tarjetas entran por vista lo decide el CSS (1 / 2 / 3 según el
 *      ancho). No hay que replicar los breakpoints en JavaScript ni escuchar
 *      el resize.
 *   2. Se puede arrastrar con el dedo y con la rueda del ratón sin que
 *      programemos nada: es el scroll del navegador.
 *   3. Si el JavaScript falla o todavía no cargó, queda una lista que se puede
 *      desplazar. Un carrusel con transform, sin JS, se queda congelado en la
 *      primera tarjeta.
 *
 * Avanza solo, siempre (fundadoras, 17-nov-2026): antes se pausaba al pasar
 * el ratón, al enfocar y al tocar en móvil —y en el teléfono nunca se
 * reanudaba, así que quedaba estático con un botón "Reanudar". Ahora solo se
 * detiene con la pestaña en segundo plano. Con `prefers-reduced-motion`
 * avanza igual pero sin desplazamiento animado (salta de tarjeta). Las
 * flechas y los puntitos siguen para quien quiera ir a su ritmo.
 */

const INTERVALO_MS = 6000;

export default function VocesCarousel({ voces }: { voces: Voz[] }) {
  const pistaRef = useRef<HTMLUListElement>(null);
  const [pausado, setPausado] = useState(false);
  const [indice, setIndice] = useState(0);
  // Empieza en true y se corrige en el efecto: en el servidor no hay
  // matchMedia, y arrancar asumiendo "sin animación" evita que el carrusel
  // salte apenas hidrata.
  // Solo decide si el desplazamiento es animado o instantáneo (ver irA).
  const reduceMotionRef = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotionRef.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Desplaza hasta la tarjeta `i`, dando la vuelta al llegar al final. */
  const irA = useCallback(
    (i: number, comportamiento: ScrollBehavior = "smooth") => {
      const pista = pistaRef.current;
      if (!pista) return;
      const total = pista.children.length;
      if (total === 0) return;
      const destino = ((i % total) + total) % total;
      const card = pista.children[destino] as HTMLElement;
      pista.scrollTo({
        left: card.offsetLeft - pista.offsetLeft,
        behavior: reduceMotionRef.current ? "auto" : comportamiento,
      });
      setIndice(destino);
    },
    []
  );

  // Avance automático. Solo se apaga con la pestaña en segundo plano o cuando
  // no hay más de una tarjeta que mostrar.
  useEffect(() => {
    if (pausado || voces.length < 2) return;
    const id = window.setInterval(() => {
      setIndice((i) => {
        const siguiente = (i + 1) % voces.length;
        irA(siguiente);
        return siguiente;
      });
    }, INTERVALO_MS);
    return () => window.clearInterval(id);
  }, [pausado, voces.length, irA]);

  // Con la pestaña en segundo plano, seguir avanzando solo gasta batería y
  // devuelve al visitante a una tarjeta cualquiera cuando vuelve.
  useEffect(() => {
    const onVisibility = () => setPausado(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /** Mantiene los puntitos en sincronía cuando se arrastra a mano. */
  const onScroll = () => {
    const pista = pistaRef.current;
    if (!pista) return;
    let masCerca = 0;
    let menorDistancia = Infinity;
    for (let i = 0; i < pista.children.length; i++) {
      const card = pista.children[i] as HTMLElement;
      const d = Math.abs(card.offsetLeft - pista.offsetLeft - pista.scrollLeft);
      if (d < menorDistancia) {
        menorDistancia = d;
        masCerca = i;
      }
    }
    setIndice(masCerca);
  };

  if (voces.length === 0) return null;
  const varias = voces.length > 1;

  return (
    <div className="mt-12 md:mt-16">
      {/* aria-roledescription + aria-live="off": el contenido cambia solo, y
          anunciar cada rotación interrumpiría la lectura. Quien navega con
          lector recorre la lista entera con las flechas del teclado. */}
      <div
        role="group"
        aria-roledescription="carrusel"
        aria-label="Voces de la comunidad"
      >
        <ul
          ref={pistaRef}
          onScroll={onScroll}
          tabIndex={0}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 rounded-2xl"
        >
          {voces.map((v) => (
            <li
              key={v.id}
              className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <figure
                className={`bg-white rounded-2xl p-8 h-full flex flex-col ${
                  v.es_miembro
                    ? "shadow-lg ring-2 ring-vc-orange/30"
                    : "shadow-sm border border-vc-cream"
                }`}
              >
                <Quote
                  className="w-8 h-8 text-vc-orange flex-shrink-0"
                  aria-hidden="true"
                />
                <blockquote className="mt-4 flex-1 text-lg text-vc-ink leading-relaxed text-left md:text-justify">
                  {v.cita}
                </blockquote>
                <figcaption className="mt-6 pt-4 border-t border-vc-cream flex items-center gap-3">
                  {/* Foto pequeña (documento nov-2026): una persona real,
                      identificable. Si no hay, el bloque queda igual que
                      antes, sin hueco. */}
                  {v.foto_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.foto_url}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-vc-cream"
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block font-semibold text-vc-blue-dark">
                      {v.nombre}
                    </span>
                    {v.contexto && (
                      // /70 y no /60: sobre blanco, #232323 al 60% queda en
                      // ~3.5:1 y no llega al 4.5:1 que pide WCAG AA.
                      <span className="block text-base text-vc-ink/70">
                        {v.contexto}
                      </span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      {varias && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => irA(indice - 1)}
            aria-label="Voz anterior"
            className="w-12 h-12 rounded-full bg-white border-2 border-vc-cream text-vc-blue flex items-center justify-center hover:border-vc-blue transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange/40"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Puntitos: 44px de área táctil aunque el punto se vea chico. */}
          <ul className="flex items-center gap-1">
            {voces.map((v, i) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => irA(i)}
                  aria-label={`Ver la voz de ${v.nombre}`}
                  aria-current={i === indice ? "true" : undefined}
                  className="w-11 h-11 flex items-center justify-center rounded-full focus-visible:ring-4 focus-visible:ring-vc-orange/40"
                >
                  <span
                    className={`block rounded-full transition-all ${
                      i === indice
                        ? "w-3 h-3 bg-vc-orange"
                        : "w-2.5 h-2.5 bg-vc-blue/25"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => irA(indice + 1)}
            aria-label="Voz siguiente"
            className="w-12 h-12 rounded-full bg-white border-2 border-vc-cream text-vc-blue flex items-center justify-center hover:border-vc-blue transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange/40"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
