import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { heroContent } from "@/lib/content";

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
export default function Hero() {
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
            <p className="mt-6 text-lg md:text-xl text-vc-ink leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {heroContent.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center lg:items-start">
              <a
                href={heroContent.ctaHref}
                className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-blue hover:bg-vc-blue-dark text-white font-semibold text-lg md:text-xl rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange/50 shadow-lg"
              >
                {heroContent.cta}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <p className="mt-3 text-base text-vc-ink/70">
                {heroContent.ctaNote}
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-2 relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto aspect-4/3 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/hero-community.jpg"
              alt={heroContent.imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 24rem"
            />
          </div>
        </div>

        {/* Video de las fundadoras — Error #6 del doc. Se graba esta semana;
            hasta entonces queda la ranura reservada. Al recibirlo, reemplazar
            este bloque por el <video> o el embed, manteniendo el aspect-video
            y los subtítulos en español (obligatorio: muchos 65+ ven en
            silencio o con volumen bajo). */}
        <div className="mt-14 md:mt-20 max-w-4xl mx-auto">
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
        </div>
      </div>
    </section>
  );
}
