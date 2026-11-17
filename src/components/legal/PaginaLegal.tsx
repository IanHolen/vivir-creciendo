import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser } from "@/lib/session";

/**
 * Marco común de /terminos y /privacidad: título, fecha de actualización,
 * cuerpo en prosa grande y legible, y los dos enlaces cruzados.
 *
 * Tono (fundadoras, 17-nov-2026): "unos términos y condiciones amigables".
 * Texto corriente, oraciones cortas, cuerpo de 18-20 px. Nada de letra chica.
 */
export default async function PaginaLegal({
  titulo,
  actualizado,
  intro,
  children,
}: {
  titulo: string;
  actualizado: string;
  intro: string;
  children: React.ReactNode;
}) {
  const { isLoggedIn, name } = await getSessionUser({});
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={name} />
      <main id="main-content" className="bg-vc-cream noise-overlay min-h-screen py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <article className="relative z-10 max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-semibold text-vc-blue hover:text-vc-orange-dark focus-visible:ring-4 focus-visible:ring-vc-blue/40 rounded"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Volver al inicio
          </Link>
          <h1 className="mt-6 font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue-dark uppercase tracking-tight text-balance">
            {titulo}
          </h1>
          <p className="mt-2 text-base text-vc-ink/60">Última actualización: {actualizado}</p>
          <p className="mt-6 text-lg md:text-xl text-vc-ink leading-relaxed">{intro}</p>

          <div className="mt-8 space-y-8 text-lg text-vc-ink/90 leading-relaxed [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:text-vc-blue-dark [&_h2]:mt-2 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2 [&_strong]:text-vc-blue-dark">
            {children}
          </div>

          <p className="mt-10 pt-6 border-t border-vc-cream text-base text-vc-ink/70">
            Documentos relacionados:{" "}
            <Link href="/terminos" className="font-semibold text-vc-blue hover:text-vc-orange-dark underline-offset-4 hover:underline">Términos y condiciones</Link>
            {" · "}
            <Link href="/privacidad" className="font-semibold text-vc-blue hover:text-vc-orange-dark underline-offset-4 hover:underline">Política de privacidad</Link>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
