import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateMyProfile } from "@/lib/profile-actions";
import { siteConfig } from "@/lib/content";

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

interface Membership {
  id: number;
  key: string;
  name: string;
  description: string | null;
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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase.rpc("get_my_profile");
  const profile = profileData as MyProfile | null;

  const { data: membershipsData } = await supabase
    .from("memberships")
    .select("id, key, name, description")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  const memberships = (membershipsData ?? []) as Membership[];

  const displayName =
    profile?.full_name ?? user.email?.split("@")[0] ?? "amig@";
  const memberSince = formatDate(profile?.created_at ?? null);
  const whatsappDigits = siteConfig.whatsapp.replace(/\D/g, "");

  return (
    <main className="min-h-screen bg-vc-cream noise-overlay px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-black text-vc-blue-dark uppercase tracking-tight">
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

        {ok && (
          <p
            role="status"
            className="mt-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-base text-green-700"
          >
            Tus cambios se guardaron.
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-700"
          >
            {error}
          </p>
        )}

        {/* Datos de la cuenta */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-vc-cream">
          <h2 className="font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
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
              className="mt-5 inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
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
          <h2 className="font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            Tu membresía
          </h2>

          {profile?.membership ? (
            <div className="mt-5 rounded-2xl bg-vc-cream/60 p-5 border border-vc-cream">
              <p className="text-sm font-semibold uppercase tracking-wide text-vc-orange">
                Plan actual
              </p>
              <p className="mt-1 text-2xl font-black text-vc-blue-dark">
                {profile.membership.name}
              </p>
              {profile.membership.description && (
                <p className="mt-2 text-lg text-vc-blue-dark/70 leading-relaxed">
                  {profile.membership.description}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 text-lg text-vc-blue-dark/70 leading-relaxed">
              Todavía no tienes una membresía activa. Escríbenos y te ayudamos a
              elegir el plan ideal para ti.
            </p>
          )}

          {memberships.length > 0 && (
            <div className="mt-6">
              <p className="text-base font-medium text-vc-blue-dark/60">
                Planes disponibles
              </p>
              <ul className="mt-3 space-y-2">
                {memberships.map((m) => {
                  const current = m.id === profile?.membership_id;
                  return (
                    <li
                      key={m.id}
                      className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 border-2 ${
                        current
                          ? "border-vc-orange bg-vc-orange/5"
                          : "border-vc-cream"
                      }`}
                    >
                      <span className="text-lg text-vc-blue-dark">{m.name}</span>
                      {current && (
                        <span className="text-sm font-semibold text-vc-orange uppercase">
                          Tu plan
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <p className="mt-6 text-base text-vc-blue-dark/60 leading-relaxed">
            Para cambiar o activar tu plan, escríbenos. Te ayudamos personalmente,
            paso a paso.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[56px] px-6 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
            >
              Cambiar mi plan por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center min-h-[56px] px-6 py-4 border-2 border-vc-blue text-vc-blue-dark hover:bg-vc-blue/5 font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
            >
              Ir a contacto
            </Link>
          </div>
        </section>

        {/* Sección admin: editar Actividades desde el perfil */}
        {profile?.is_admin && (
          <section className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 border-2 border-vc-blue/30">
            <h2 className="font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
              Administración
            </h2>
            <p className="mt-2 text-lg text-vc-blue-dark/70 leading-relaxed">
              Eres administrador. El grid de Actividades es el escaparate de la
              página: edítalo para mantenerlo fresco y atractivo.
            </p>
            <Link
              href="/admin"
              className="mt-5 inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-blue hover:bg-vc-blue-dark text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
            >
              Editar Actividades
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
