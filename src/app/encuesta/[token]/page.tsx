import Link from "next/link";
import { Star, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/session";
import { responderEncuesta } from "@/lib/encuesta-actions";

export const metadata = { title: "¿Cómo la pasaste? — Vivir Creciendo" };
export const dynamic = "force-dynamic";

/**
 * Encuesta post-actividad (fundadoras, 17-nov-2026). Llega por correo con un
 * token único; no pide iniciar sesión. Calificación de 1 a 5 con estrellas
 * grandes, un cuadro libre para contar cómo la pasó y el permiso explícito
 * para publicar el comentario como testimonio (con nombre y ciudad si quiere).
 */
export default async function EncuestaPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string; gracias?: string; ya?: string }>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const { isLoggedIn, name } = await getSessionUser({});

  const db = createAdminClient();
  const { data: enc } = await db
    .from("encuestas")
    .select("id, activity_title, respondida_at, user_id")
    .eq("token", token)
    .maybeSingle();
  const { data: perfil } = enc
    ? await db.from("profiles").select("full_name").eq("id", enc.user_id).maybeSingle()
    : { data: null };

  const respondida = Boolean(enc?.respondida_at) || sp.gracias === "1" || sp.ya === "1";

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={name} />
      <main id="main-content" className="bg-vc-cream noise-overlay min-h-screen py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {!enc ? (
            <div className="text-center">
              <h1 className="font-(family-name:--font-display) text-3xl font-black text-vc-blue-dark uppercase tracking-tight">Este enlace no es válido</h1>
              <p className="mt-4 text-lg text-vc-ink/80">Puede que esté incompleto. Abre de nuevo el correo y toca el botón, o escríbenos y te mandamos otro.</p>
              <Link href="/" className="mt-8 inline-flex min-h-[52px] items-center px-6 rounded-xl bg-vc-orange text-white font-semibold text-lg">Volver al inicio</Link>
            </div>
          ) : respondida ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto w-14 h-14 text-vc-orange" aria-hidden="true" />
              <h1 className="mt-4 font-(family-name:--font-display) text-3xl font-black text-vc-blue-dark uppercase tracking-tight">¡Gracias!</h1>
              <p className="mt-4 text-lg text-vc-ink/80">
                {sp.ya === "1"
                  ? "Esta encuesta ya estaba respondida. Gracias de nuevo por tu tiempo."
                  : "Leemos cada respuesta. Nos ayuda a que Vivir Creciendo sea cada vez mejor para ti."}
              </p>
              <Link href="/#actividades" className="mt-8 inline-flex min-h-[52px] items-center px-6 rounded-xl bg-vc-orange text-white font-semibold text-lg">Ver las próximas actividades</Link>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-widest text-vc-orange-dark">Tu opinión nos importa</p>
              <h1 className="mt-2 font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue-dark uppercase tracking-tight text-balance">
                ¿Cómo la pasaste en {enc.activity_title}?
              </h1>
              <p className="mt-4 text-lg text-vc-ink/80">
                {perfil?.full_name ? `${perfil.full_name}, son` : "Son"} dos minutos. Tus palabras nos ayudan a mejorar y, si nos das permiso, a que otras personas se animen a sumarse.
              </p>

              {sp.error && (
                <p role="alert" className="mt-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-lg text-red-800">{sp.error}</p>
              )}

              <form action={responderEncuesta} className="mt-8 space-y-8">
                <input type="hidden" name="token" value={token} />

                <fieldset>
                  <legend className="text-xl font-semibold text-vc-blue-dark">1. ¿Qué tanto la disfrutaste?</legend>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label key={n} className="cursor-pointer">
                        <input type="radio" name="calificacion" value={n} required className="sr-only peer" />
                        <span className="flex flex-col items-center justify-center w-16 h-20 rounded-2xl border-2 border-vc-cream text-vc-ink/60 peer-checked:border-vc-orange peer-checked:bg-vc-orange/10 peer-checked:text-vc-orange-dark peer-focus-visible:ring-4 peer-focus-visible:ring-vc-orange/30 hover:border-vc-blue/40 transition-colors">
                          <Star className="w-7 h-7" aria-hidden="true" />
                          <span className="mt-1 text-lg font-semibold">{n}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-base text-vc-ink/60">1 = no me gustó · 5 = me encantó</p>
                </fieldset>

                <div>
                  <label htmlFor="comentario" className="block text-xl font-semibold text-vc-blue-dark">2. Cuéntanos cómo la pasaste</label>
                  <p className="mt-1 text-base text-vc-ink/60">Con tus palabras, como se lo contarías a una amiga. Qué te gustó, qué te llevaste, qué cambiarías.</p>
                  <textarea
                    id="comentario"
                    name="comentario"
                    rows={5}
                    className="mt-3 w-full rounded-2xl border-2 border-vc-cream px-5 py-4 text-lg text-vc-ink focus:outline-none focus:border-vc-blue focus-visible:ring-4 focus-visible:ring-vc-blue/20"
                    placeholder="Me gustó mucho porque…"
                  />
                </div>

                <div className="rounded-2xl bg-vc-cream p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="permite_publicar" className="mt-1 w-6 h-6 shrink-0 rounded border-2 border-vc-ink/30 accent-vc-orange" />
                    <span className="text-lg text-vc-ink">
                      <strong className="text-vc-blue-dark">Pueden publicar mi comentario</strong> como testimonio en el sitio y redes de Vivir Creciendo.
                    </span>
                  </label>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="block text-base font-semibold text-vc-blue-dark">¿Con qué nombre?</span>
                      <input name="nombre_publico" placeholder="Ej.: María, o María González" className="mt-1.5 w-full rounded-xl border-2 border-white bg-white px-4 py-3 text-lg focus:outline-none focus:border-vc-blue" />
                    </label>
                    <label className="block">
                      <span className="block text-base font-semibold text-vc-blue-dark">¿Desde dónde? (opcional)</span>
                      <input name="ciudad" placeholder="Ej.: Rosario, Argentina" className="mt-1.5 w-full rounded-xl border-2 border-white bg-white px-4 py-3 text-lg focus:outline-none focus:border-vc-blue" />
                    </label>
                  </div>
                  <p className="mt-3 text-sm text-vc-ink/60">Si no marcas la casilla, tu respuesta la leemos solo nosotras.</p>
                </div>

                <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center min-h-[56px] px-10 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg">
                  Enviar mi respuesta
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
