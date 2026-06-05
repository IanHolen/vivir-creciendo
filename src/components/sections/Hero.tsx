import Image from "next/image";
import { heroContent, quienesSomos } from "@/lib/content";

export default function Hero() {
  return (
    <section
      id="quienes-somos"
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-cream noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Título + subtítulo */}
        <div className="text-center">
          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-black text-vc-blue-dark uppercase tracking-tight">
            {heroContent.title}
          </h1>
          <p className="mt-4 font-[var(--font-subtitle)] text-xl md:text-2xl text-vc-blue uppercase italic">
            {heroContent.subtitle}
          </p>
        </div>

        {/* Imagen */}
        <div className="mt-10 mx-auto w-72 h-72 md:w-96 md:h-96 relative rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/images/hero-community.jpg"
            alt="Comunidad de adultos mayores compartiendo y aprendiendo juntos"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 288px, 384px"
          />
        </div>

        {/* Quiénes somos — intro + texto largo, ARRIBA de los botones (pedido de Ian). */}
        <p className="mt-10 text-lg md:text-xl text-vc-blue-dark/80 leading-relaxed text-center">
          {heroContent.description}
        </p>

        <div className="mt-6 space-y-5">
          {quienesSomos.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-lg md:text-xl leading-relaxed text-vc-blue-dark/80 ${
                i === quienesSomos.paragraphs.length - 1
                  ? "font-semibold text-vc-blue-dark text-center"
                  : ""
              }`}
            >
              {p}
            </p>
          ))}
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
