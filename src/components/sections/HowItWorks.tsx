import { howItWorksSteps } from "@/lib/content";

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          CÓMO FUNCIONA
        </h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksSteps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-vc-blue text-white font-[var(--font-display)] text-2xl font-black">
                {step.number}
              </div>
              <h3 className="mt-5 font-semibold text-xl text-vc-blue-dark">
                {step.title}
              </h3>
              <p className="mt-2 text-vc-blue-dark/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
