import { notFound } from "next/navigation";
import { GraduationCap, Calendar, Clock, Monitor, User, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { courses } from "@/lib/content";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) return notFound();

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero */}
        <section className="bg-vc-blue py-20 md:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <a
              href="/#cursos"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-lg focus-visible:ring-4 focus-visible:ring-white/50 rounded-lg px-2 py-1"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Volver a cursos
            </a>
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-white/20 mb-6">
              <GraduationCap className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight">
              {course.title}
            </h1>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-vc-blue-dark/80 leading-relaxed">
              {course.longDescription}
            </p>
          </div>
        </section>

        {/* Schedule details */}
        <section className="bg-vc-cream py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
              DETALLES DEL TALLER
            </h2>
            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-vc-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-lg text-vc-blue-dark">Fechas</p>
                  <p className="text-vc-blue-dark/70 text-lg">{course.dates}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-vc-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-lg text-vc-blue-dark">Horario</p>
                  <p className="text-vc-blue-dark/70 text-lg">{course.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Monitor className="w-6 h-6 text-vc-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-lg text-vc-blue-dark">Formato</p>
                  <p className="text-vc-blue-dark/70 text-lg">{course.format}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructor */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
              INSTRUCTOR
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-vc-cream flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-vc-blue/40" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-vc-blue-dark">
                  {course.instructor}
                </h3>
                <p className="mt-2 text-lg text-vc-blue-dark/70 leading-relaxed">
                  {course.instructorBio}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Price + CTA */}
        <section className="bg-vc-cream py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-vc-blue-dark/50 text-lg mb-4">{course.price}</p>
            <a
              href="/#contacto"
              className="inline-flex items-center justify-center min-h-[56px] px-10 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
            >
              QUIERO INSCRIBIRME
            </a>
            <p className="mt-4 text-sm text-vc-blue-dark/50">
              Cupos limitados. Escríbenos por WhatsApp o correo para reservar tu lugar.
            </p>
          </div>
        </section>

        {/* Back link */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
          <a
            href="/#cursos"
            className="inline-flex items-center gap-2 text-vc-blue hover:text-vc-orange transition-colors text-lg font-medium focus-visible:ring-4 focus-visible:ring-vc-orange rounded-lg px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Ver todos los cursos y talleres
          </a>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
