import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check, Clock, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { isProvider } from "@/lib/payments/plans";
import { obtenerSuscripcionPayPal } from "@/lib/payments/paypal";
import { obtenerSuscripcionMP } from "@/lib/payments/mercadopago";
import { actualizarSuscripcion, buscarSuscripcion, conGracia } from "@/lib/payments/access";
import AutoRefresh from "./AutoRefresh";

export const metadata = { title: "Confirmando tu membresía — Vivir Creciendo" };
export const dynamic = "force-dynamic";

type Estado = "activa" | "pendiente" | "fallida";

/**
 * A dónde vuelve la socia después de pagar.
 *
 * Esta página NO otorga el acceso por lo que diga la URL (cualquiera puede
 * escribir ?subscription_id=...). Lo que hace es preguntarle al proveedor
 * por el estado real de ESA suscripción, y solo si pertenece al usuario con
 * sesión actualiza la base. El webhook hará lo mismo por su lado.
 */
export default async function RetornoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const { isLoggedIn, name } = await getSessionUser(sp);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");

  const proveedor = sp.proveedor;
  const externalId =
    proveedor === "paypal" ? sp.subscription_id : proveedor === "mercadopago" ? sp.preapproval_id : undefined;

  let estado: Estado = "pendiente";
  let detalle = "";

  if (isProvider(proveedor) && externalId) {
    const fila = await buscarSuscripcion(proveedor, externalId);
    if (fila && fila.user_id === user.id) {
      try {
        if (proveedor === "paypal") {
          const s = await obtenerSuscripcionPayPal(externalId);
          const next = s.billing_info?.next_billing_time ?? null;
          await actualizarSuscripcion("paypal", externalId, {
            status: s.status,
            next_billing_at: next,
            ...(s.status === "ACTIVE" && next ? { paid_until: conGracia(new Date(next)).toISOString() } : {}),
            raw: s,
          });
          estado = s.status === "ACTIVE" ? "activa" : s.status === "APPROVAL_PENDING" || s.status === "APPROVED" ? "pendiente" : "fallida";
        } else {
          const s = await obtenerSuscripcionMP(externalId);
          const next = s.next_payment_date ?? null;
          await actualizarSuscripcion("mercadopago", externalId, {
            status: s.status,
            next_billing_at: next,
            ...(s.status === "authorized" && next ? { paid_until: conGracia(new Date(next)).toISOString() } : {}),
            raw: s,
          });
          estado = s.status === "authorized" ? "activa" : s.status === "pending" ? "pendiente" : "fallida";
        }
      } catch (e) {
        console.error("[retorno] no se pudo consultar al proveedor:", e);
        estado = "pendiente";
        detalle = "No pudimos confirmar con el proveedor en este momento. Lo seguimos intentando.";
      }
    } else {
      estado = "fallida";
      detalle = "No encontramos esta suscripción en tu cuenta.";
    }
  } else {
    estado = "fallida";
    detalle = "Faltan datos del pago en el enlace de regreso.";
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={name} />
      <main id="main-content" className="bg-vc-cream noise-overlay min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center">
          {estado === "activa" && (
            <>
              <span className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-vc-orange/10">
                <Check className="w-10 h-10 text-vc-orange" aria-hidden="true" />
              </span>
              <h1 className="mt-6 font-(family-name:--font-display) text-3xl font-black text-vc-blue-dark uppercase tracking-tight text-balance">
                ¡Listo! Ya eres parte
              </h1>
              <p className="mt-4 text-lg text-vc-ink/80 leading-relaxed">
                Tu membresía está activa. Desde ahora puedes inscribirte a todas las
                actividades. Te esperamos.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#actividades" className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg">
                  Ver las actividades
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link href="/perfil" className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 border-2 border-vc-orange-dark text-vc-orange-dark hover:bg-vc-orange-dark hover:text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50">
                  Ir a mi perfil
                </Link>
              </div>
            </>
          )}

          {estado === "pendiente" && (
            <>
              <span className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-vc-blue-soft">
                <Clock className="w-10 h-10 text-vc-blue" aria-hidden="true" />
              </span>
              <h1 className="mt-6 font-(family-name:--font-display) text-3xl font-black text-vc-blue-dark uppercase tracking-tight text-balance">
                Estamos confirmando tu pago
              </h1>
              <p className="mt-4 text-lg text-vc-ink/80 leading-relaxed">
                {detalle || "Suele tardar unos segundos. Esta página se actualiza sola; no hace falta que hagas nada."}
              </p>
              <AutoRefresh />
              <p className="mt-6 text-base text-vc-ink/60">
                Si después de unos minutos sigue así, revisa tu perfil o escríbenos.
              </p>
              <Link href="/perfil" className="mt-4 inline-flex items-center justify-center min-h-[52px] px-6 py-3 border-2 border-vc-cream text-vc-blue-dark font-semibold text-lg rounded-xl hover:border-vc-blue">
                Ir a mi perfil
              </Link>
            </>
          )}

          {estado === "fallida" && (
            <>
              <span className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
                <AlertTriangle className="w-10 h-10 text-red-600" aria-hidden="true" />
              </span>
              <h1 className="mt-6 font-(family-name:--font-display) text-3xl font-black text-vc-blue-dark uppercase tracking-tight text-balance">
                No se completó el pago
              </h1>
              <p className="mt-4 text-lg text-vc-ink/80 leading-relaxed">
                {detalle || "No se realizó ningún cobro."} Puedes volver a intentarlo cuando quieras.
              </p>
              <Link href="/membresia" className="mt-8 inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg">
                Volver a intentar
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
