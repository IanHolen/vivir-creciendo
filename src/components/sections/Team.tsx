import { User } from "lucide-react";
import { teamMembers } from "@/lib/content";

export default function Team() {
  return (
    <section id="quienes" className="bg-vc-cream py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          QUIÉNES TE ACOMPAÑAN
        </h2>
        <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
            >
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full mx-auto bg-vc-cream flex items-center justify-center">
                  <User className="w-12 h-12 text-vc-blue/40" aria-hidden="true" />
                </div>
              )}
              <h3 className="mt-5 font-semibold text-xl text-vc-blue-dark">
                {member.name}
              </h3>
              <p className="text-vc-blue text-base">{member.role}</p>
              {member.quote && (
                <blockquote className="mt-4 italic text-vc-blue-dark/70 leading-relaxed">
                  &ldquo;{member.quote}&rdquo;
                </blockquote>
              )}
            </div>
          ))}
          {/* Placeholder for more members */}
          <div className="bg-white/50 rounded-2xl border-2 border-dashed border-vc-blue/20 p-8 max-w-md w-full flex items-center justify-center">
            <span className="text-vc-blue/40 text-lg text-center">
              Más facilitadores próximamente
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
