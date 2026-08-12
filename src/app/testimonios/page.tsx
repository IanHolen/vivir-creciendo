import Link from "next/link";
import { ArrowLeft, ArrowRight, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { finalCta, testimoniosPage } from "@/lib/content";
import { getTestimoniosVideo } from "@/lib/testimonios";
import { getSessionUser } from "@/lib/session";

export const metadata = {
  title: "Testimonios — Vivir Creciendo",
  description:
    "Miembros de Vivir Creciendo cuentan en video qué cambió desde que forman parte de la comunidad.",
};

/**
 * /testimonios — punto 10 de la lista de Ian (12-ago-2026).
 *
 * La versión grande de las "Voces" de la portada: acá los videos ocupan la
 * pantalla en vez de ser tarjetas de texto. Se administra en
 * /admin/testimonios y los archivos se suben en /admin/multimedia.
 *
 * Ningún video arranca solo y todos llevan `preload="metadata"`: con cinco
 * testimonios en la página, precargarlos enteros serían cientos de megabytes
 * antes de que nadie pulse nada.
 */
export default async function TestimoniosPage({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string }>;
}) {
  const sp = await searchParams;
  const [testimonios, { isLoggedIn, name }] = await Promise.all([
    getTestimoniosVideo(),
    getSessionUser(sp),
  ]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={name} />
      <main className="bg-white">
        <section className="bg-vc-blue py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-lg focus-visible:ring-4 focus-visible:ring-white/50 rounded-lg px-2 py-1"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Volver al inicio
            </Link>
            <h1 className="font-(family-name:--font-display) text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight">
              {testimoniosPage.title}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/90 leading-relaxed">
              {testimoniosPage.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {testimonios.length === 0 ? (
              <div className="rounded-3xl border border-vc-cream bg-vc-cream/40 p-12 text-center">
                <Video
                  className="w-12 h-12 mx-auto text-vc-orange/60"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="mt-4 text-xl text-vc-ink/75">
                  {testimoniosPage.vacio}
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                {testimonios.map((t) => (
                  <li key={t.id}>
                    <figure>
                      <video
                        src={t.video_url ?? undefined}
                        poster={t.poster_url ?? undefined}
                        controls
                        preload="metadata"
                        playsInline
                        className="w-full aspect-video rounded-2xl bg-black shadow-lg"
                      >
                        {/* PENDIENTE fundadoras: pista de subtítulos .vtt por
                            video. El doc los marca como obligatorios — buena
                            parte de este público mira sin sonido. Cuando estén,
                            se agrega acá un <track kind="captions" srcLang="es"
                            default>. */}
                        Tu navegador no puede reproducir este video.
                      </video>

                      <figcaption className="mt-5">
                        {t.titular && (
                          <p className="font-(family-name:--font-subtitle) text-xl md:text-2xl italic text-vc-blue-dark leading-snug">
                            {t.titular}
                          </p>
                        )}
                        <p className="mt-2 text-lg font-semibold text-vc-blue-dark">
                          {t.nombre}
                        </p>
                        {t.contexto && (
                          <p className="text-base text-vc-ink/70">{t.contexto}</p>
                        )}
                        {t.descripcion && (
                          <p className="mt-3 text-lg text-vc-ink/80 leading-relaxed text-justify hyphens-auto">
                            {t.descripcion}
                          </p>
                        )}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Salida única, al mismo destino que todos los CTA del sitio. */}
        <section className="bg-vc-cream py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight text-balance">
              {finalCta.title}
            </h2>
            <Link
              href="/#contacto"
              className="mt-6 inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg md:text-xl rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg"
            >
              {finalCta.button}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <p className="mt-3 text-base text-vc-ink/70">{finalCta.note}</p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
