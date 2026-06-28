import Image from "next/image";
import { heroContent, quienesSomos } from "@/lib/content";

export default function Hero() {
  const paragraphs = quienesSomos.paragraphs;
  const bodyParagraphs = paragraphs.slice(0, -1);
  const closingParagraph = paragraphs[paragraphs.length - 1];

  return (
    <section
      id="quienes-somos"
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-cream noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Bloque superior: 2 columnas en desktop (texto izq · imagen der),
            stack compacto en mobile (texto → imagen). Composición intencional
            para equilibrar el peso visual y no dejar la foto flotando sola. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Texto: título + subtítulo + intro corta y cálida (KISS 60+) */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-black text-vc-blue-dark tracking-tight">
              {heroContent.title}
            </h1>
            <p className="mt-4 font-[var(--font-subtitle)] text-xl md:text-2xl text-vc-blue italic">
              {heroContent.subtitle}
            </p>
            <p className="mt-6 text-lg md:text-xl text-vc-blue-dark/80 leading-relaxed">
              {heroContent.description}
            </p>
          </div>

          {/* Imagen: llena su columna y queda alineada a la derecha en desktop. */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto aspect-square rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/hero-community.jpg"
              alt="Comunidad de adultos mayores compartiendo y aprendiendo juntos"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 28rem"
            />
          </div>
        </div>

        {/* Video institucional — espacio reservado (Ian 2026-06-28).
            Ian entrega el video en julio 2026: NO insertar <video> todavía,
            solo dejar la ranura lista para reemplazar este placeholder. */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
          <div
            className="relative aspect-video w-full rounded-3xl overflow-hidden bg-vc-blue/5 border border-vc-blue/10 flex flex-col items-center justify-center text-center px-6"
            role="img"
            aria-label="Video próximamente"
          >
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/70 shadow">
              <svg
                className="w-7 h-7 text-vc-blue translate-x-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <p className="mt-4 text-base md:text-lg font-medium text-vc-blue-dark/60">
              Video próximamente
            </p>
          </div>
        </div>

        {/* Quiénes somos — texto largo (full width), ARRIBA de los botones
            (pedido de Ian). Una sola columna, alineado a la izquierda, ancho
            amplio para legibilidad 60+. */}
        <div className="mt-12 md:mt-16 max-w-5xl mx-auto space-y-4 text-left">
          {bodyParagraphs.map((p, i) => (
            <p
              key={i}
              className="text-lg md:text-xl leading-relaxed text-vc-blue-dark/80"
            >
              {p}
            </p>
          ))}
          <p className="text-lg md:text-xl leading-relaxed font-semibold text-vc-blue-dark">
            {closingParagraph}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {quienesSomos.highlights.map((phrase) => (
            <li
              key={phrase}
              className="bg-white/70 rounded-2xl p-6 text-center text-lg font-medium italic text-vc-blue-dark leading-snug border border-white/80"
            >
              &ldquo;{phrase}&rdquo;
            </li>
          ))}
        </ul>

        {/* Botones CTA — debajo del texto Quiénes somos. */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#membresias"
            className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
          >
            {heroContent.ctaPrimary}
          </a>
          <a
            href="#actividades"
            className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 text-vc-blue-dark font-semibold text-lg hover:text-vc-orange transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded-xl"
          >
            {heroContent.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
