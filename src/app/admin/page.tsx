import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  setAdmin,
  adminResetPassword,
} from "@/lib/admin-actions";

export const metadata = {
  title: "Panel de actividades — Vivir Creciendo",
};

interface AdminActivity {
  id: string;
  title: string;
  short_preview: string | null;
  full_description: string | null;
  week: number | null;
  sort_order: number | null;
  is_active: boolean;
}

const inputClass =
  "mt-1 w-full min-h-[52px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 text-vc-blue-dark";
const labelClass = "block text-base font-medium text-vc-blue-dark";

function Fields({ a }: { a?: AdminActivity }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className={labelClass}>
          Título
          <input
            name="title"
            defaultValue={a?.title ?? ""}
            required
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className={labelClass}>
            Semana
            <input
              name="week"
              type="number"
              defaultValue={a?.week ?? ""}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Orden
            <input
              name="sort_order"
              type="number"
              defaultValue={a?.sort_order ?? ""}
              className={inputClass}
            />
          </label>
        </div>
      </div>
      <label className={`${labelClass} mt-4`}>
        Adelanto corto (lo ve quien no inició sesión)
        <textarea
          name="short_preview"
          defaultValue={a?.short_preview ?? ""}
          rows={2}
          className={inputClass}
        />
      </label>
      <label className={`${labelClass} mt-4`}>
        Descripción completa (la ve quien inició sesión)
        <textarea
          name="full_description"
          defaultValue={a?.full_description ?? ""}
          rows={4}
          className={inputClass}
        />
      </label>
      <label className="mt-4 flex items-center gap-3 text-lg text-vc-blue-dark">
        <input
          name="is_active"
          type="checkbox"
          defaultChecked={a?.is_active ?? true}
          className="w-6 h-6 accent-vc-orange"
        />
        Visible en la página
      </label>
    </>
  );
}

export default async function AdminPage({
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <main className="min-h-screen bg-vc-cream noise-overlay flex items-center justify-center px-4 py-16">
        <div className="relative z-10 max-w-md text-center bg-white rounded-3xl shadow-xl p-10">
          <h1 className="font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase">
            Acceso restringido
          </h1>
          <p className="mt-3 text-lg text-vc-blue-dark/70">
            Esta sección es solo para administradores.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .order("week", { ascending: true, nullsFirst: false })
    .order("sort_order", { ascending: true, nullsFirst: false });

  const rows = (activities ?? []) as AdminActivity[];

  const { data: adminsData } = await supabase.rpc("list_admins");
  const admins = (adminsData ?? []) as { id: string; email: string }[];

  return (
    <main className="min-h-screen bg-vc-cream noise-overlay px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-black text-vc-blue-dark uppercase tracking-tight">
            Actividades
          </h1>
          <Link
            href="/"
            className="text-vc-blue-dark/70 hover:text-vc-orange font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
        <p className="mt-2 text-lg text-vc-blue-dark/70">
          Edita los recuadros de actividades de la semana. Los cambios se ven en
          la página al guardar.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-700"
          >
            No se pudo guardar: {error}
          </p>
        )}
        {ok && (
          <p
            role="status"
            className="mt-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-base text-green-800"
          >
            {ok}
          </p>
        )}

        {/* Editar / eliminar existentes */}
        <div className="mt-8 space-y-6">
          {rows.map((a) => (
            <form
              key={a.id}
              action={updateActivity}
              className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-vc-cream"
            >
              <input type="hidden" name="id" value={a.id} />
              <Fields a={a} />
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center min-h-[52px] px-6 py-3 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl"
                >
                  Guardar cambios
                </button>
                <button
                  type="submit"
                  formAction={deleteActivity}
                  className="inline-flex items-center justify-center min-h-[52px] px-6 py-3 border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold text-lg rounded-xl"
                >
                  Eliminar
                </button>
              </div>
            </form>
          ))}
          {rows.length === 0 && (
            <p className="text-lg text-vc-blue-dark/60">
              Todavía no hay actividades. Crea la primera abajo.
            </p>
          )}
        </div>

        {/* Crear nueva */}
        <div className="mt-12">
          <h2 className="font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            Agregar actividad
          </h2>
          <form
            action={createActivity}
            className="mt-4 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-vc-cream"
          >
            <Fields />
            <button
              type="submit"
              className="mt-6 inline-flex items-center justify-center min-h-[52px] px-6 py-3 bg-vc-blue hover:bg-vc-blue-dark text-white font-semibold text-lg rounded-xl"
            >
              Crear actividad
            </button>
          </form>
        </div>

        {/* Gestionar administradores */}
        <div className="mt-12">
          <h2 className="font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            Administradores
          </h2>
          <p className="mt-2 text-base text-vc-blue-dark/70">
            Las personas con acceso a este panel. Para agregar a alguien, primero
            debe haberse registrado en la página.
          </p>

          <div className="mt-4 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-vc-cream">
            <ul className="divide-y divide-vc-cream">
              {admins.map((admin) => (
                <li
                  key={admin.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="text-lg text-vc-blue-dark break-all">
                    {admin.email}
                    {admin.id === user.id && (
                      <span className="ml-2 text-sm text-vc-blue-dark/50">
                        (tú)
                      </span>
                    )}
                  </span>
                  {admin.id !== user.id && (
                    <form action={setAdmin}>
                      <input type="hidden" name="email" value={admin.email} />
                      <input type="hidden" name="is_admin" value="false" />
                      <button
                        type="submit"
                        className="min-h-[44px] px-4 py-2 border-2 border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-xl"
                      >
                        Quitar
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>

            <form
              action={setAdmin}
              className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-end"
            >
              <label className={`${labelClass} flex-grow`}>
                Correo de la persona a hacer administradora
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  className={inputClass}
                />
              </label>
              <input type="hidden" name="is_admin" value="true" />
              <button
                type="submit"
                className="inline-flex items-center justify-center min-h-[52px] px-6 py-3 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl"
              >
                Hacer admin
              </button>
            </form>
          </div>
        </div>

        {/* Restablecer contraseña de un usuario (recuperación asistida) */}
        <div className="mt-12">
          <h2 className="font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            Restablecer contraseña
          </h2>
          <p className="mt-2 text-base text-vc-blue-dark/70">
            Si alguien no puede entrar, fíjale una contraseña nueva y pásasela.
          </p>
          <form
            action={adminResetPassword}
            className="mt-4 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-vc-cream grid grid-cols-1 sm:grid-cols-2 gap-4 sm:items-end"
          >
            <label className={labelClass}>
              Correo del usuario
              <input
                name="target_email"
                type="email"
                required
                placeholder="correo@ejemplo.com"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Contraseña nueva
              <input
                name="new_password"
                type="text"
                required
                minLength={8}
                placeholder="Al menos 8 caracteres"
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-2 inline-flex items-center justify-center min-h-[52px] px-6 py-3 bg-vc-blue hover:bg-vc-blue-dark text-white font-semibold text-lg rounded-xl"
            >
              Restablecer contraseña
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
