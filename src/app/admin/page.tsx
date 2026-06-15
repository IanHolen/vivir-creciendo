import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles,
  CalendarDays,
  User,
  Users,
  Tag,
  HelpCircle,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  setAdmin,
  adminResetPassword,
} from "@/lib/admin-actions";
import { PLAN_META } from "@/lib/activities";

export const metadata = {
  title: "Panel de administración — Vivir Creciendo",
};

interface AdminActivity {
  id: string;
  title: string;
  short_preview: string | null;
  full_description: string | null;
  week: number | null;
  sort_order: number | null;
  is_active: boolean;
  image_url: string | null;
  fecha: string | null;
  hora: string | null;
  modalidad: string | null;
  duracion: string | null;
  facilitador: string | null;
  facilitador_rol: string | null;
  publico_objetivo: string | null;
  precio: string | null;
  precio_nota: string | null;
  beneficios: string | null;
  enlace_inscripcion: string | null;
  faq: string | null;
  plan: string | null;
}

const inputClass =
  "mt-1 w-full min-h-[52px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 text-vc-blue-dark bg-white";
const labelClass = "block text-base font-medium text-vc-blue-dark";

type IconType = React.ComponentType<{ className?: string }>;

/** Agrupa campos del form bajo un título claro con ícono (UX 60+). */
function Section({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: IconType;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-8 pt-6 border-t border-vc-cream first:mt-0 first:pt-0 first:border-0">
      <legend className="flex items-center gap-2 text-lg font-bold text-vc-blue-dark">
        <Icon className="w-5 h-5 text-vc-orange" aria-hidden="true" />
        {title}
      </legend>
      {hint && <p className="mt-1 text-sm text-vc-blue-dark/55">{hint}</p>}
      <div className="mt-3 space-y-4">{children}</div>
    </fieldset>
  );
}

/** Selector de plan: 4 botones grandes (incluye "Sin plan"). */
function PlanPicker({ current }: { current?: string | null }) {
  const cur = (current ?? "").trim().toLowerCase();
  const opts: { value: string; label: string }[] = [
    { value: "", label: "Sin plan" },
    { value: "gratuita", label: "Gratuita" },
    { value: "basica", label: "Básica" },
    { value: "plus", label: "Plus" },
  ];
  return (
    <fieldset>
      <legend className={labelClass}>Plan al que pertenece</legend>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {opts.map((o) => (
          <label key={o.value || "none"} className="cursor-pointer">
            <input
              type="radio"
              name="plan"
              value={o.value}
              defaultChecked={cur === o.value}
              className="peer sr-only"
            />
            <span className="flex items-center justify-center min-h-[52px] px-3 py-3 text-lg font-semibold rounded-xl border-2 border-vc-cream text-vc-blue-dark/70 transition-colors peer-checked:border-vc-orange peer-checked:bg-vc-orange peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-vc-orange/40">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Fields({ a }: { a?: AdminActivity }) {
  return (
    <>
      <Section icon={Sparkles} title="Lo esencial">
        <label className={labelClass}>
          Título
          <input
            name="title"
            defaultValue={a?.title ?? ""}
            required
            placeholder="Ej. Taller de memoria y bienestar"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Adelanto corto (lo ve quien no inició sesión)
          <textarea
            name="short_preview"
            defaultValue={a?.short_preview ?? ""}
            rows={2}
            placeholder="Una o dos líneas que enganchen."
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Descripción completa (la ve quien inició sesión)
          <textarea
            name="full_description"
            defaultValue={a?.full_description ?? ""}
            rows={4}
            placeholder="Cuenta de qué trata la actividad, con todo el detalle."
            className={inputClass}
          />
        </label>
        <div>
          <span className={labelClass}>Imagen de la actividad</span>
          {a?.image_url && (
            <div className="mt-2 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.image_url}
                alt={`Imagen actual de ${a.title}`}
                className="w-32 h-24 object-cover rounded-xl border border-vc-cream"
              />
              <span className="text-base text-vc-blue-dark/60">
                Imagen actual. Sube una nueva para reemplazarla.
              </span>
            </div>
          )}
          <input
            name="image"
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-base text-vc-blue-dark file:mr-4 file:min-h-[44px] file:px-5 file:py-2 file:rounded-xl file:border-0 file:bg-vc-cream file:text-vc-blue-dark file:font-medium hover:file:bg-vc-cream/70 file:cursor-pointer"
          />
          <p className="mt-1 text-sm text-vc-blue-dark/50">
            Formato JPG o PNG, máximo 5 MB.
          </p>
        </div>
        <label className="flex items-center gap-3 text-lg text-vc-blue-dark">
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={a?.is_active ?? true}
            className="w-6 h-6 accent-vc-orange"
          />
          Visible en la página
        </label>
      </Section>

      <Section
        icon={CalendarDays}
        title="Cuándo y cómo"
        hint="Tal cual quieres que lo lea la gente. Puedes dejar en blanco lo que no aplique."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={labelClass}>
            Fecha
            <input
              name="fecha"
              defaultValue={a?.fecha ?? ""}
              placeholder="Miércoles 16, 23 y 30 de julio"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Horario
            <input
              name="hora"
              defaultValue={a?.hora ?? ""}
              placeholder="10 hs CDMX · 12 hs ARG"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Duración
            <input
              name="duracion"
              defaultValue={a?.duracion ?? ""}
              placeholder="3 sesiones en vivo de 90 min c/u"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Modalidad
            <select
              name="modalidad"
              defaultValue={a?.modalidad ?? ""}
              className={inputClass}
            >
              <option value="">— Sin especificar —</option>
              <option value="online">Online</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </label>
        </div>
      </Section>

      <Section icon={User} title="Quién la dirige">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={labelClass}>
            Facilitador/a
            <input
              name="facilitador"
              defaultValue={a?.facilitador ?? ""}
              placeholder="Abigail Sosa Mendoza"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Rol o credenciales
            <input
              name="facilitador_rol"
              defaultValue={a?.facilitador_rol ?? ""}
              placeholder="Psicóloga · especialista en adultos mayores"
              className={inputClass}
            />
          </label>
        </div>
      </Section>

      <Section icon={Users} title="Para quién y qué incluye">
        <label className={labelClass}>
          Público al que va dirigida
          <input
            name="publico_objetivo"
            defaultValue={a?.publico_objetivo ?? ""}
            placeholder="Adultos mayores de 60 que quieran ejercitar la memoria"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Qué incluye (una por línea)
          <textarea
            name="beneficios"
            defaultValue={a?.beneficios ?? ""}
            rows={3}
            placeholder={"Grupo de WhatsApp\nGuía en PDF\nGrabación de las sesiones"}
            className={inputClass}
          />
        </label>
      </Section>

      <Section icon={Tag} title="Precio e inscripción">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={labelClass}>
            Precio
            <input
              name="precio"
              defaultValue={a?.precio ?? ""}
              placeholder="USD 85"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Nota del precio
            <input
              name="precio_nota"
              defaultValue={a?.precio_nota ?? ""}
              placeholder="Precio especial hasta el 3 de julio"
              className={inputClass}
            />
          </label>
        </div>
        <label className={labelClass}>
          Enlace de inscripción
          <input
            name="enlace_inscripcion"
            type="url"
            defaultValue={a?.enlace_inscripcion ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
        </label>
        <PlanPicker current={a?.plan} />
      </Section>

      <Section
        icon={HelpCircle}
        title="Preguntas frecuentes"
        hint="Opcional. Escribe cada pregunta y su respuesta."
      >
        <label className={labelClass}>
          <span className="sr-only">Preguntas frecuentes</span>
          <textarea
            name="faq"
            defaultValue={a?.faq ?? ""}
            rows={4}
            placeholder={"¿Necesito experiencia previa? No, es para todos los niveles.\n¿Quedan grabadas? Sí, recibes la grabación."}
            className={inputClass}
          />
        </label>
      </Section>

      <Section
        icon={SlidersHorizontal}
        title="Orden en la página"
        hint="Controla en qué posición aparece. Déjalo como está si no estás seguro."
      >
        <div className="grid grid-cols-2 gap-4 max-w-xs">
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
      </Section>
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
        {/* Encabezado */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-vc-orange">
              Panel de administración
            </p>
            <h1 className="mt-1 font-[var(--font-display)] text-3xl md:text-4xl font-black text-vc-blue-dark uppercase tracking-tight">
              Actividades
            </h1>
          </div>
          <Link
            href="/"
            className="flex-shrink-0 text-vc-blue-dark/70 hover:text-vc-orange font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
        <p className="mt-2 text-lg text-vc-blue-dark/70">
          Edita las actividades de la comunidad. Los cambios se ven en la página
          al guardar.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>No se pudo guardar: {error}</span>
          </p>
        )}
        {ok && (
          <p
            role="status"
            className="mt-6 flex items-start gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-base text-green-800"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{ok}</span>
          </p>
        )}

        {/* Editar / eliminar existentes */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            Tus actividades
          </h2>
          <span className="text-base text-vc-blue-dark/55">
            {rows.length} {rows.length === 1 ? "actividad" : "actividades"}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {rows.map((a) => {
            const plan = a.plan
              ? PLAN_META[a.plan.trim().toLowerCase() as keyof typeof PLAN_META]
              : null;
            return (
              <details
                key={a.id}
                className="group bg-white rounded-2xl shadow-sm border border-vc-cream overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-6 hover:bg-vc-cream/30 focus-visible:ring-4 focus-visible:ring-vc-orange/40 rounded-2xl">
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="font-semibold text-xl text-vc-blue-dark truncate">
                      {a.title}
                    </span>
                    {a.week != null && (
                      <span className="flex-shrink-0 text-sm text-vc-blue-dark/50">
                        Sem. {a.week}
                      </span>
                    )}
                    {plan && (
                      <span
                        className={`flex-shrink-0 text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${plan.badgeClass}`}
                      >
                        {plan.label}
                      </span>
                    )}
                    {!a.is_active && (
                      <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-vc-cream text-vc-blue-dark/60">
                        Oculta
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    className="w-6 h-6 flex-shrink-0 text-vc-blue-dark/40 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <form
                  action={updateActivity}
                  className="px-6 pb-6 md:px-8 md:pb-8 border-t border-vc-cream"
                >
                  <input type="hidden" name="id" value={a.id} />
                  <div className="pt-6">
                    <Fields a={a} />
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
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
              </details>
            );
          })}
          {rows.length === 0 && (
            <p className="rounded-2xl bg-white border border-vc-cream p-8 text-lg text-vc-blue-dark/60">
              Todavía no hay actividades. Crea la primera abajo.
            </p>
          )}
        </div>

        {/* Crear nueva */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            <Plus className="w-6 h-6 text-vc-orange" aria-hidden="true" />
            Agregar actividad
          </h2>
          <form
            action={createActivity}
            className="mt-4 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-vc-cream"
          >
            <Fields />
            <button
              type="submit"
              className="mt-8 inline-flex items-center justify-center min-h-[52px] px-6 py-3 bg-vc-blue hover:bg-vc-blue-dark text-white font-semibold text-lg rounded-xl"
            >
              Crear actividad
            </button>
          </form>
        </div>

        {/* Gestionar administradores */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            <ShieldCheck className="w-6 h-6 text-vc-orange" aria-hidden="true" />
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
          <h2 className="flex items-center gap-2 font-[var(--font-display)] text-2xl font-black text-vc-blue-dark uppercase tracking-tight">
            <KeyRound className="w-6 h-6 text-vc-orange" aria-hidden="true" />
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
