import Link from "next/link";
import { ArrowRight, Check, LogIn, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { cancelacion, membershipPlans } from "@/lib/content";
import { PLANES, isPlanKey, type PlanKey } from "@/lib/payments/plans";
import { paypalConfigurado } from "@/lib/payments/paypal";
import { mercadoPagoConfigurado, montoArs } from "@/lib/payments/mercadopago";
import { iniciarSuscripcion } from "@/lib/subscription-actions";
import ProviderButtons from "./ProviderButtons";

export const metadata = {
  title: "Sumarme a la membresía — Vivir Creciendo",
};

/**
 * /membresia — la página de pago.
 *
 * Dos decisiones y nada más: el plan (mensual o anual) y con qué pagar
 * (PayPal o Mercado Pago). Al pulsar, la socia va a la página de pago del
 * proveedor y vuelve a /membresia/retorno. La tarjeta nunca se escribe acá.
 */
export default async function MembresiaPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; error?: string; cancelado?: string; vista?: string }>;
}) {
  const sp = await searchParams;
  const planInicial: PlanKey = isPlanKey(sp.plan) ? sp.plan : "mensual";
  const { isLoggedIn, name } = await getSessionUser(sp);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let yaTiene = false;
  if (user) {
    const { data } = await supabase.rpc("has_membership");
    yaTiene = Boolean(data);
  }

  const arsMensual = mercadoPagoConfigurado ? montoArs("mensual") : null;
  const arsAnual = mercadoPagoConfigurado ? montoArs("anual") : null;
  const planPago = membershipPlans.find((p) => p.kind === "paga");
  const MENSAJES_ERROR: Record<string, string> = {
    datos: "Elige un plan y una forma de pago.",
    proveedor: "No pudimos abrir la página de pago. Intenta de nuevo en un momento o escríbenos.",
  };
  const errorMessage = sp.error ? (MENSAJES_ERROR[sp.error] ?? "No se pudo continuar.") : null;

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={name} />
      <main id="main-content" className="bg-vc-cream noise-overlay min-h-screen py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue-dark uppercase tracking-tight text-center text-balance">
            Sumarme a la membresía
          </h1>
          <p className="mt-4 text-center text-lg md:text-xl text-vc-ink/80 max-w-2xl mx-auto leading-relaxed">
            Elige cómo quieres pagar. Te llevamos a la página segura de PayPal o
            de Mercado Pago y vuelves aquí con tu membresía activa.
          </p>

          {errorMessage && (
            <p role="alert" className="mt-8 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-lg text-red-800 text-center">
              {errorMessage}
            </p>
          )}
          {sp.cancelado && (
            <p role="status" className="mt-8 rounded-xl bg-white border border-vc-cream px-5 py-4 text-lg text-vc-ink/80 text-center">
              No se realizó ningún cobro. Cuando quieras, vuelves a intentarlo.
            </p>
          )}

          {/* Sin sesión: primero la cuenta, después el pago. */}
          {!user ? (
            <div className="mt-10 bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center">
              <p className="text-xl text-vc-blue-dark font-semibold">
                Primero necesitas una cuenta en Vivir Creciendo.
              </p>
              <p className="mt-3 text-lg text-vc-ink/75 leading-relaxed">
                Es gratis y solo pide tu nombre y tu correo. Así sabemos a quién
                activarle la membresía cuando pagues.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/registro?next=${encodeURIComponent(`/membresia?plan=${planInicial}`)}`}
                  className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg"
                >
                  Crear mi cuenta
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href={`/login?next=${encodeURIComponent(`/membresia?plan=${planInicial}`)}`}
                  className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 border-2 border-vc-orange-dark text-vc-orange-dark hover:bg-vc-orange-dark hover:text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50"
                >
                  <LogIn className="w-5 h-5" aria-hidden="true" />
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          ) : yaTiene ? (
            <div className="mt-10 bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center">
              <p className="inline-flex items-center gap-2 text-xl text-vc-blue-dark font-semibold">
                <Check className="w-6 h-6 text-vc-orange" aria-hidden="true" />
                Tu membresía ya está activa.
              </p>
              <p className="mt-3 text-lg text-vc-ink/75">
                Puedes ver los detalles y el próximo cobro en tu perfil.
              </p>
              <Link
                href="/perfil"
                className="mt-6 inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg"
              >
                Ir a mi perfil
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <form action={iniciarSuscripcion} className="mt-10 space-y-6">
              {/* Enter en el formulario dispararía el PRIMER botón submit (PayPal)
                  aunque la socia quisiera Mercado Pago. Este botón oculto y
                  deshabilitado absorbe el submit implícito. */}
              <button type="submit" disabled hidden aria-hidden="true" tabIndex={-1} />
              {/* Plan */}
              <fieldset className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                <legend className="sr-only">Elige tu plan</legend>
                <h2 className="text-xl font-semibold text-vc-blue-dark">1. Elige tu plan</h2>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.values(PLANES) as (typeof PLANES)[PlanKey][]).map((p) => (
                    <label
                      key={p.key}
                      className="flex items-start gap-4 min-h-[88px] p-5 rounded-2xl border-2 border-vc-cream cursor-pointer transition-colors hover:border-vc-blue/40 has-[:checked]:border-vc-orange has-[:checked]:bg-vc-orange/5 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-vc-orange/30"
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={p.key}
                        defaultChecked={p.key === planInicial}
                        className="mt-1.5 w-6 h-6 accent-vc-orange shrink-0"
                      />
                      <span>
                        <span className="block font-(family-name:--font-display) text-2xl text-vc-blue-dark">
                          {p.usdLabel}
                        </span>
                        <span className="block mt-1 text-base text-vc-ink/70">{p.nota}</span>
                        {p.key === "mensual" && arsMensual && (
                          <span className="block mt-1 text-sm text-vc-ink/55">
                            Con Mercado Pago: ${arsMensual.toLocaleString("es-AR")} ARS / mes
                          </span>
                        )}
                        {p.key === "anual" && arsAnual && (
                          <span className="block mt-1 text-sm text-vc-ink/55">
                            Con Mercado Pago: ${arsAnual.toLocaleString("es-AR")} ARS / año
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>

                {planPago && (
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {planPago.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-base text-vc-ink/80">
                        <Check className="w-5 h-5 text-vc-orange-dark shrink-0 mt-0.5" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>

              {/* Proveedor */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                <h2 className="text-xl font-semibold text-vc-blue-dark">2. Elige cómo pagar</h2>
                <p className="mt-2 text-base text-vc-ink/70 leading-relaxed">
                  Si vives en Argentina y tienes cuenta de Mercado Pago, cobra
                  en pesos. Desde cualquier otro país, PayPal cobra en dólares y
                  acepta tarjeta aunque no tengas cuenta de PayPal.
                </p>
                <ProviderButtons paypal={paypalConfigurado} mercadopago={mercadoPagoConfigurado} />
                <p className="mt-5 flex items-start gap-2 text-base text-vc-ink/65 leading-relaxed">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-vc-orange" aria-hidden="true" />
                  El pago se hace en la página segura del proveedor. Nosotros
                  nunca vemos tu tarjeta.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-vc-blue/15">
                <h3 className="font-semibold text-lg text-vc-blue-dark">{cancelacion.title}</h3>
                <p className="mt-2 text-base text-vc-ink/75 leading-relaxed">{cancelacion.text}</p>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
