import { notFound } from "next/navigation";
import { Sparkles, Lock, LogIn, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getActivity } from "@/lib/activities";
import { getSessionUser } from "@/lib/session";

export const metadata = {
  title: "Actividad — Vivir Creciendo",
};

export default async function ActivityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ vista?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const [activity, { isLoggedIn, name }] = await Promise.all([
    getActivity(id),
    getSessionUser(sp),
  ]);

  if (!activity) return notFound();

  // El detalle completo está gateado por sesión (RPC get_activities devuelve
  // full_description = NULL si no hay sesión). Sin sesión mostramos el adelanto
  // + CTA de login, igual que la sección de la landing.
  const hasFullDetail = activity.full_description != null;

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={name} />
      <main className="bg-white">
        {/* Hero */}
        <section className="bg-vc-blue py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <a
              href="/#actividades"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-lg focus-visible:ring-4 focus-visible:ring-white/50 rounded-lg px-2 py-1"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Volver a actividades
            </a>
            {activity.week != null && (
              <div className="inline-flex items-center gap-2 text-white/90 text-base font-medium mb-4">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span>Semana {activity.week}</span>
              </div>
            )}
            <h1 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight">
              {activity.title}
            </h1>
          </div>
        </section>

        {/* Imagen (si la actividad tiene una) */}
        {activity.image_url && (
          <section className="px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-12">
            <div className="max-w-3xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activity.image_url}
                alt={activity.title}
                className="w-full rounded-3xl shadow-xl object-cover max-h-[28rem]"
              />
            </div>
          </section>
        )}

        {/* Contenido */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {hasFullDetail ? (
              <p className="text-xl md:text-2xl text-vc-blue-dark/80 leading-relaxed whitespace-pre-line">
                {activity.full_description}
              </p>
            ) : (
              <>
                <p className="text-xl md:text-2xl text-vc-blue-dark/80 leading-relaxed">
                  {activity.short_preview}
                </p>
                <div className="mt-10 rounded-2xl bg-vc-cream/40 border border-vc-cream p-8 text-center">
                  <p className="flex items-center justify-center gap-2 text-lg text-vc-blue-dark/70">
                    <Lock className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    Inicia sesión para ver el detalle completo de esta actividad.
                  </p>
                  <a
                    href="/login"
                    className="mt-6 inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
                  >
                    <LogIn className="w-5 h-5" aria-hidden="true" />
                    Iniciar sesión
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Volver */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
          <a
            href="/#actividades"
            className="inline-flex items-center gap-2 text-vc-blue hover:text-vc-orange transition-colors text-lg font-medium focus-visible:ring-4 focus-visible:ring-vc-orange rounded-lg px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Ver todas las actividades
          </a>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
