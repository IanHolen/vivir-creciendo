import { emotionalQuestions } from "@/lib/content";

export default function EmotionalQuestions() {
  return (
    <section className="bg-white py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {emotionalQuestions.map((question) => (
          <div
            key={question}
            className="bg-vc-cream/50 rounded-2xl p-8 text-center border border-vc-cream"
          >
            <p className="text-xl font-medium text-vc-blue-dark leading-relaxed italic">
              {question}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
