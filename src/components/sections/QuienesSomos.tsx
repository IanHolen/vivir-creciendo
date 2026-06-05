import { quienesSomos } from "@/lib/content";

export default function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="scroll-mt-20 md:scroll-mt-24 bg-vc-cream noise-overlay py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          {quienesSomos.title}
        </h2>
        <p className="mt-4 text-center font-[var(--font-subtitle)] text-xl md:text-2xl italic text-vc-blue">
          {quienesSomos.lead}
        </p>

        <div className="mt-10 space-y-5">
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
      </div>
    </section>
  );
}
