import { User } from "lucide-react";
import { teamMembers } from "@/lib/content";

export default function Team() {
  const cofounders = teamMembers.filter((m) => m.cofounder);
  const collaborators = teamMembers.filter((m) => !m.cofounder);

  return (
    <section id="quienes" className="bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          QUIÉNES TE ACOMPAÑAN
        </h2>

        {/* Cofounders */}
        <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-8">
          {cofounders.map((member) => (
            <div
              key={member.name}
              className="bg-vc-cream/50 rounded-2xl p-8 max-w-md w-full text-center border border-vc-cream"
            >
              <div className="w-24 h-24 rounded-full mx-auto bg-vc-cream flex items-center justify-center">
                <User className="w-10 h-10 text-vc-blue/40" aria-hidden="true" />
              </div>
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
        </div>

        {/* Collaborators */}
        {collaborators.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-vc-blue-dark/60 text-center mb-8">
              Nuestro equipo de especialistas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {collaborators.map((member) => (
                <div key={member.name} className="text-center p-4">
                  <div className="w-14 h-14 rounded-full mx-auto bg-vc-cream/60 flex items-center justify-center mb-3">
                    <User className="w-6 h-6 text-vc-blue/30" aria-hidden="true" />
                  </div>
                  <p className="font-medium text-vc-blue-dark text-base">
                    {member.name}
                  </p>
                  <p className="text-vc-blue-dark/50 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
