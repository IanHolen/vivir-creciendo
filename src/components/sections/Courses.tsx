import { GraduationCap, Calendar, Clock, Monitor } from "lucide-react";
import { courses } from "@/lib/content";

export default function Courses() {
  return (
    <section id="cursos" className="bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark uppercase tracking-tight">
            CURSOS Y TALLERES
          </h2>
          <p className="mt-4 text-xl text-vc-blue-dark/70">
            Aprende algo nuevo, a tu ritmo y en buena compañía
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-vc-cream/40 rounded-2xl p-8 flex flex-col border border-vc-cream"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-vc-blue/10">
                <GraduationCap className="w-6 h-6 text-vc-blue" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-semibold text-xl text-vc-blue-dark leading-snug">
                {course.title}
              </h3>
              <p className="mt-3 text-vc-blue-dark/70 leading-relaxed flex-grow">
                {course.description}
              </p>
              <div className="mt-5 space-y-2 text-base text-vc-blue-dark/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{course.dates}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{course.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{course.format}</span>
                </div>
                {course.instructor && (
                  <p className="text-vc-blue font-medium pt-1">
                    {course.instructor}
                  </p>
                )}
              </div>
              <a
                href={`/talleres/${course.slug}`}
                className="mt-6 w-full inline-flex items-center justify-center min-h-[56px] px-6 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
              >
                CONOCER MÁS
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
