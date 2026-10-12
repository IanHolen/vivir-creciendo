import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { heroContent, memberCountLine } from "@/lib/content";
import { getSiteMedia } from "@/lib/media-queries";

/**
 * Sección 01 — Hero.
 *
 * UN SOLO CTA (Error #4 del doc, Ley de Hick). Antes convivían aquí tres
 * botones que competían entre sí ("Conoce nuestras membresías", "Conoce
 * nuestras actividades", "Conoce más sobre Nosotros"); a más opciones, más
 * tiempo de decisión y más probabilidad de no elegir ninguna.
 *
 * El texto largo de "Quiénes somos" que vivía dentro del hero se movió a sus
 * propias secciones (El Momento y Qué es Vivir Creciendo): cada sección tiene
 * un solo trabajo, nunca dos.
 */
export default async function Hero() {
  const miembros = memberCountLine();
  // La foto y el video salen de las ranuras que se editan en
  // /admin/multimedia. Si no hay nada asignado, `foto` cae al archivo de
  // /public que trae el sitio y `video` queda en null.
  const media = await getSiteMedia();
  const foto = media["hero.foto"];
  const video = media["hero.video"];

  return (
    // Fondo crema (#F7F3EE), como pide el doc para el hero. Abre la
    // alternancia crema / blanco que ordena el resto de la página.
    <section className="bg-vc-cream py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Desktop: texto 60% · imagen 40%. Mobile: imagen arriba, texto
            abajo (el orden que pide el doc para que la foto haga de gancho). */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          <div className="order-2 lg:order-1 lg:col-span-3 text-center lg:text-left">
            {/* Tamaños según la especificación tipográfica del doc:
                48-56px en desktop, 32-38px en mobile. Nunca por debajo. */}
            <h1 className="font-(family-name:--font-display) text-[2rem] md:text-[2.375rem] lg:text-5xl font-black text-vc-blue-dark tracking-tight text-balance leading-tight">
              {heroContent.title}
            </h1>
            {/* Justificado solo en desktop: en mobile la columna es tan
                angosta que justificar abre ríos de espacio incluso con
                guionado, y ahí el centrado se lee mejor. */}
            <p className="mt-6 text-lg md:text-xl text-vc-ink leading-relaxed max-w-2xl mx-auto lg:mx-0 lg:text-justify hyphens-auto">
              {heroContent.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center lg:items-start">
              {/* CTA en naranja (Ian 2026-08-12). Es la excepción deliberada a
                  la regla de "naranja solo para íconos": este es el único
                  botón de alta sobre fondo claro de la página y tiene que
                  ganarle a todo lo demás.
                  Contraste: blanco sobre #D85A35 da 3.86:1, por debajo del
                  4.5:1 de AA para texto normal — por eso el texto se mantiene
                  en 18px+ semibold, donde rige el umbral de texto grande
                  (3:1). Si alguna vez baja de 18px, hay que pasar el fondo a
                  vc-orange-dark. El anillo de foco va en azul: naranja sobre
                  naranja no se ve. */}
              <a
                href={heroContent.ctaHref}
                className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg md:text-xl rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg"
              >
                {heroContent.cta}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <p className="mt-3 text-base text-vc-ink/70">
                {heroContent.ctaNote}
              </p>
            </div>
          </div>

          {/* La foto va como <figure> para poder colgarle el pie con la cifra
              de miembros (Ian 2026-08-12): el dato de prueba social entra en
              el primer golpe de vista, sin robarle protagonismo al titular.
              Si `memberCount` vuelve a null, el pie desaparece solo. */}
          <figure className="order-1 lg:order-2 lg:col-span-2 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl">
              {foto.url && (
                <Image
                  src={foto.url}
                  alt={foto.alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 24rem"
                />
              )}
            </div>
            {miembros && (
              <figcaption className="mt-3 text-center text-base md:text-lg font-semibold text-vc-blue">
                {miembros}
              </figcaption>
            )}
          </figure>
        </div>

        {/* Video de las fundadoras — Error #6 del doc.
            Publicado el 20-ago-2026: Nurit y Alejandra contando de qué se
            trata, 1:13, con los subtítulos en español ya incrustados en la
            imagen (el doc los marca como obligatorios: buena parte de este
            público mira sin sonido).
            Se puede reemplazar sin tocar código desde /admin/multimedia,
            ranura "Video de las fundadoras". El recuadro de "próximamente" de
            abajo queda para ese caso: si alguien deja la ranura vacía y borra
            el archivo por defecto, la portada no se rompe. */}
        <div className="mt-14 md:mt-20 max-w-4xl mx-auto">
          {video.url ? (
            <video
              src={video.url}
              // La carátula solo corresponde al video que trae el sitio: si
              // alguien sube otro desde el panel, un fotograma de esta
              // grabación sería la portada equivocada.
              poster={
                video.desdeBiblioteca ? undefined : video.slot.fallbackPoster
              }
              controls
              // Sin autoplay: un video que arranca solo con sonido, en una
              // portada, es la forma más rápida de que alguien cierre la
              // pestaña. `preload="metadata"` baja la carátula y la duración,
              // no el video entero.
              preload="metadata"
              playsInline
              className="w-full aspect-video rounded-3xl bg-black shadow-xl"
            >
              Tu navegador no puede reproducir este video.
            </video>
          ) : (
            <div
              className="relative aspect-video w-full rounded-3xl overflow-hidden bg-white border border-vc-blue/15 flex flex-col items-center justify-center text-center px-6"
              role="img"
              aria-label="Video de las fundadoras, próximamente"
            >
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-vc-orange/10">
                <svg
                  className="w-7 h-7 text-vc-orange translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <p className="mt-4 text-base md:text-lg font-medium text-vc-ink/70">
                Nurit y Alejandra te cuentan de qué se trata — video próximamente
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
