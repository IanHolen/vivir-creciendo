import Image from "next/image";
import { heroContent } from "@/lib/content";

export default function Hero() {
  return (
    <section className="bg-vc-cream noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl lg:text-7xl font-black text-vc-blue-dark uppercase tracking-tight">
            {heroContent.title}
          </h1>
          <p className="mt-4 font-[var(--font-subtitle)] text-xl md:text-2xl text-vc-blue uppercase italic">
            {heroContent.subtitle}
          </p>
          <p className="mt-6 text-lg md:text-xl text-vc-blue-dark/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {heroContent.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
        <div className="flex-shrink-0 w-72 h-72 md:w-96 md:h-96 relative rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/images/hero-community.jpg"
            alt="Comunidad de adultos mayores compartiendo y aprendiendo juntos"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 288px, 384px"
          />
        </div>
      </div>
    </section>
  );
}
