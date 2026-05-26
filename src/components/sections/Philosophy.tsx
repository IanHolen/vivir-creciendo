import { philosophy } from "@/lib/content";

export default function Philosophy() {
  return (
    <section className="bg-vc-cream py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <blockquote className="text-2xl md:text-3xl font-medium text-vc-blue-dark leading-relaxed italic">
          &ldquo;{philosophy.quote}&rdquo;
        </blockquote>
        <p className="mt-4 text-vc-blue/80 font-medium">
          — {philosophy.author}
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {philosophy.principles.map((principle) => {
            const [title, desc] = principle.split(" — ");
            return (
              <div key={principle} className="text-center">
                <h3 className="font-semibold text-lg text-vc-blue-dark">
                  {title}
                </h3>
                <p className="mt-2 text-vc-blue-dark/60">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
