import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateMyProfile } from "@/lib/profile-actions";
import { whatsappHref, siteConfig, cancelacion } from "@/lib/content";
import { PLANES, PROVIDER_LABEL, type PlanKey, type Provider } from "@/lib/payments/plans";
import { cancelarSuscripcion } from "@/lib/subscription-actions";
import CancelButton from "./CancelButton";

export const metadata = {
  title: "Mi perfil — Vivir Creciendo",
};

interface MyProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  membership_id: number | null;
  membership: {
    id: number;
    key: string;
    name: string;
    description: string | null;
    is_active: boolean;
  } | null;
  created_at: string | null;
}

interface MySubscription {
  provider: Provider;
  plan: PlanKey;
  status: string;
  currency: string;
  amount: number;
  paid_until: string | null;
  next_billing_at: string | null;
  cancel_requested_at: string | null;
}

const inputClass =
  "mt-2 w-full min-h-[56px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 text-vc-blue-dark";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  // Códigos, no texto libre: una URL con ?ok=<texto> podría mostrar cualquier
  // cosa dentro de una caja verde con el diseño del sitio (phishing fácil).
  const MENSAJES_OK: Record<string, string> = {
    "1": "Tus cambios se guardaron.",
    cancelada: "Tu membresía quedó cancelada. Sigues participando hasta el final del período que ya pagaste.",
    "ya-activa": "Tu membresía ya está activa.",
  };
  const MENSAJES_ERROR: Record<string, string> = {
    "no-activa": "No tienes una membresía activa para cancelar.",
    cancelar: "No pudimos cancelar en este momento. Intenta de nuevo o escríbenos.",
  };
  const okMessage = ok ? (MENSAJES_OK[ok] ?? null) : null;
  const errorMessage = error ? (MENSAJES_ERROR[error] ?? "No se pudo completar la acción.") : null;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase.rpc("get_my_profile");
  const profile = profileData as MyProfile | null;

  const { data: subData } = await supabase.rpc("my_subscription");
  const sub = (subData as MySubscription | null) ?? null;
  const { data: hasMembership } = await supabase.rpc("has_membership");
  const tieneMembresia = Boolean(hasMembership);
  // Derivado del estado del proveedor, no solo de nuestro botón: si cancela
  // desde paypal.com o la app de MP, también tiene que verse como cancelada.
  const cancelada = Boolean(
    sub && (sub.cancel_requested_at || ["CANCELLED", "cancelled", "EXPIRED"].includes(sub.status))
  );
  const suspendida = Boolean(sub && (sub.status === "SUSPENDED" || sub.status === "paused"));

  const displayName =
    profile?.full_name ?? user.email?.split("@")[0] ?? "amig@";
  const memberSince = formatDate(profile?.created_at ?? null);
  // null mientras no haya número dedicado de la comunidad; el botón de
  // WhatsApp se oculta en vez de apuntar a un link roto.
  const wa = whatsappHref();

  return (
    <main className="min-h-screen bg-vc-cream noise-overlay px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue-dark uppercase tracking-tight">
            Mi perfil
          </h1>
          <Link
            href="/"
            className="text-vc-blue-dark/70 hover:text-vc-orange font-medium focus-visible:ring-4 focus-visible:ring-vc-orange rounded-lg px-2 py-1"
          >
            ← Volver al inicio
          </Link>
        </div>
        <p className="mt-2 text-lg text-vc-blue-dark/70">
          Hola, {displayName}. Aquí ves y actualizas tus datos.
        </p>

        {okMessage && (
          <p
            role="status"
            className="mt-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-base text-green-700"
          >
            {okMessage}
          </p>
        )}
        {errorMessage && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-700"
          >
            {errorMessage}
          </p>
        )}

        {/* Datos de la cuenta */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-vc-cream">
          <h2 className="font-(family-name:--font-display) text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            Tus datos
          </h2>

          <form action={updateMyProfile} className="mt-6">
            <label className="block text-lg font-medium text-vc-blue-dark">
              Tu nombre
              <input
                name="full_name"
                type="text"
                maxLength={120}
                defaultValue={profile?.full_name ?? ""}
                placeholder="¿Cómo te llamas?"
                className={inputClass}
              />
            </label>
            <p className="mt-2 text-base text-vc-blue-dark/60">
              Así te saludamos en la página.
            </p>
            <button
              type="submit"
              className="mt-5 inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg"
            >
              Guardar nombre
            </button>
          </form>

          <dl className="mt-8 border-t border-vc-cream pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <dt className="text-base font-medium text-vc-blue-dark/60">
                Correo electrónico
              </dt>
              <dd className="text-lg text-vc-blue-dark break-all">
                {profile?.email ?? user.email}
              </dd>
            </div>
            {memberSince && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <dt className="text-base font-medium text-vc-blue-dark/60">
                  Miembro desde
                </dt>
                <dd className="text-lg text-vc-blue-dark">{memberSince}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Membresía */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-vc-cream">
          <h2 className="font-(family-name:--font-display) text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            Tu membresía
          </h2>

          {tieneMembresia ? (
            <div className="mt-5 rounded-2xl bg-vc-cream/60 p-5 border border-vc-cream">
              <p className="text-sm font-semibold uppercase tracking-wide text-vc-orange">
                {cancelada ? "Cancelada · acceso vigente" : suspendida ? "Pago pendiente" : "Activa"}
              </p>
              <p className="mt-1 text-2xl font-black text-vc-blue-dark">
                Membresía {sub ? PLANES[sub.plan].nombre.toLowerCase() : ""}
              </p>
              <dl className="mt-4 space-y-2 text-lg text-vc-blue-dark/80">
                {sub && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <dt className="text-base text-vc-blue-dark/60">Pagas con</dt>
                    <dd>{PROVIDER_LABEL[sub.provider]} · {sub.currency === "USD" ? PLANES[sub.plan].usdLabel : `$${Number(sub.amount).toLocaleString("es-AR")} ARS`}</dd>
                  </div>
                )}
                {sub && !cancelada && !suspendida && formatDate(sub.next_billing_at) && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <dt className="text-base text-vc-blue-dark/60">Próximo cobro</dt>
                    <dd>{formatDate(sub.next_billing_at)}</dd>
                  </div>
                )}
                {sub && (cancelada || suspendida) && formatDate(sub.paid_until) && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <dt className="text-base text-vc-blue-dark/60">Participas hasta</dt>
                    <dd>{formatDate(sub.paid_until)}</dd>
                  </div>
                )}
                {!sub && profile?.membership && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <dt className="text-base text-vc-blue-dark/60">Plan</dt>
                    <dd>{profile.membership.name}</dd>
                  </div>
                )}
              </dl>
              {suspendida && (
                <p className="mt-4 text-base text-vc-ink/80 leading-relaxed">
                  No se pudo cobrar tu último pago. Revisa tu tarjeta en{" "}
                  {sub ? PROVIDER_LABEL[sub.provider] : "tu cuenta"} para que la membresía
                  continúe. Si no se resuelve, sigues participando hasta la fecha de arriba.
                </p>
              )}
            </div>
          ) : sub && (sub.status === "APPROVAL_PENDING" || sub.status === "pending") ? (
            <div className="mt-5 rounded-2xl bg-vc-blue-soft p-5 border border-vc-blue/15">
              <p className="text-lg text-vc-blue-dark leading-relaxed">
                Tienes un pago empezado con {PROVIDER_LABEL[sub.provider]} que no se
                completó. No se realizó ningún cobro.
              </p>
              <Link
                href="/membresia"
                className="mt-4 inline-flex items-center justify-center min-h-[52px] px-6 py-3 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50"
              >
                Terminar de sumarme
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-5 text-lg text-vc-blue-dark/70 leading-relaxed">
                Todavía no tienes una membresía activa. Con ella entras a todas las
                actividades: {PLANES.mensual.usdLabel} o {PLANES.anual.usdLabel}.
              </p>
              <Link
                href="/membresia"
                className="mt-5 inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg"
              >
                Quiero sumarme
              </Link>
            </>
          )}

          {/* Cancelar: detrás de un <details>, como todo lo irreversible del
              sitio. HTML puro, funciona sin JavaScript. */}
          {sub && (sub.status === "ACTIVE" || sub.status === "authorized" || suspendida) && !cancelada && (
            <details className="mt-8 rounded-2xl border border-vc-cream p-5">
              <summary className="cursor-pointer text-lg font-semibold text-vc-blue-dark">
                Cancelar mi membresía
              </summary>
              <p className="mt-3 text-base text-vc-blue-dark/70 leading-relaxed">
                {cancelacion.text}
              </p>
              <form action={cancelarSuscripcion} className="mt-4">
                <CancelButton />
              </form>
            </details>
          )}

          <p className="mt-6 text-base text-vc-blue-dark/60 leading-relaxed">
            ¿Dudas con tu pago? Escríbenos y te ayudamos personalmente.
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[52px] px-6 py-3 border-2 border-vc-orange-dark text-vc-orange-dark hover:bg-vc-orange/10 font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50"
              >
                Escribir por WhatsApp
              </a>
            )}
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center justify-center min-h-[52px] px-6 py-3 border-2 border-vc-cream text-vc-blue-dark hover:border-vc-blue font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50"
            >
              {siteConfig.email}
            </a>
          </div>
        </section>

        {/* Sección admin: editar Actividades desde el perfil */}
        {profile?.is_admin && (
          <section className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 border-2 border-vc-blue/30">
            <h2 className="font-(family-name:--font-display) text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
              Administración
            </h2>
            <p className="mt-2 text-lg text-vc-blue-dark/70 leading-relaxed">
              Eres administrador. El grid de Actividades es el escaparate de la
              página: edítalo para mantenerlo fresco y atractivo.
            </p>
            <Link
              href="/admin"
              className="mt-5 inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 shadow-lg"
            >
              Editar Actividades
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
