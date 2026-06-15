import { notFound } from "next/navigation";
import {
  Sparkles,
  Lock,
  LogIn,
  ArrowLeft,
  CalendarDays,
  Clock,
  Hourglass,
  Monitor,
  User,
  Users,
  Tag,
  Check,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getActivity, planMeta, modalidadLabel } from "@/lib/activities";
import { getSessionUser } from "@/lib/session";

export const metadata = {
  title: "Actividad — Vivir Creciendo",
};

type IconType = React.ComponentType<{ className?: string }>;

/** Una fila de la ficha; no se renderiza si el campo viene vacío. */
function FichaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-6 h-6 text-vc-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <dt className="text-sm font-semibold uppercase tracking-wide text-vc-blue-dark/50">
          {label}
        </dt>
        <dd className="text-lg text-vc-blue-dark">{value}</dd>
      </div>
    </div>
  );
}

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
  // + CTA de login, igual que la sección de la landing. El resto de campos
  // (fecha, precio, facilitador…) son públicos: impulsan la inscripción.
  const hasFullDetail = activity.full_description != null;
  const plan = planMeta(activity.plan);
  const beneficios = (activity.beneficios ?? "")
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);
  const facilitador = activity.facilitador_rol
    ? `${activity.facilitador ?? ""}${activity.facilitador ? " — " : ""}${activity.facilitador_rol}`
    : activity.facilitador;
  const precio = activity.precio_nota
    ? `${activity.precio ?? ""}${activity.precio ? " · " : ""}${activity.precio_nota}`
    : activity.precio;
  const hasFicha =
    activity.fecha ||
    activity.hora ||
    activity.duracion ||
    activity.modalidad ||
    facilitador ||
    precio ||
    activity.publico_objetivo;

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
            <div className="flex items-center justify-center gap-3 mb-4">
              {activity.week != null && (
                <span className="inline-flex items-center gap-2 text-white/90 text-base font-medium">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Semana {activity.week}
                </span>
              )}
              {plan && (
                <span
                  className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${plan.badgeClass}`}
                >
                  Plan {plan.label}
                </span>
              )}
            </div>
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

        {/* Ficha pública (fecha, precio, facilitador…) */}
        {hasFicha && (
          <section className="px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
            <div className="max-w-3xl mx-auto">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-3xl bg-vc-cream/40 border border-vc-cream p-8 md:p-10">
                <FichaRow icon={CalendarDays} label="Fecha" value={activity.fecha} />
                <FichaRow icon={Clock} label="Horario" value={activity.hora} />
                <FichaRow icon={Hourglass} label="Duración" value={activity.duracion} />
                <FichaRow
                  icon={Monitor}
                  label="Modalidad"
                  value={modalidadLabel(activity.modalidad)}
                />
                <FichaRow icon={User} label="Facilitador/a" value={facilitador} />
                <FichaRow icon={Tag} label="Precio" value={precio} />
                <FichaRow
                  icon={Users}
                  label="Para quién es"
                  value={activity.publico_objetivo}
                />
              </dl>
            </div>
          </section>
        )}

        {/* Descripción (gateada por sesión) */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
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

        {/* Qué incluye */}
        {beneficios.length > 0 && (
          <section className="pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
                Qué incluye
              </h2>
              <ul className="mt-6 space-y-3">
                {beneficios.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg text-vc-blue-dark/80">
                    <span className="flex-shrink-0 mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-vc-orange/10">
                      <Check className="w-4 h-4 text-vc-orange" aria-hidden="true" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Preguntas frecuentes */}
        {activity.faq && (
          <section className="pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="flex items-center gap-2 font-[var(--font-display)] text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
                <HelpCircle className="w-7 h-7 text-vc-orange" aria-hidden="true" />
                Preguntas frecuentes
              </h2>
              <p className="mt-6 text-lg text-vc-blue-dark/80 leading-relaxed whitespace-pre-line">
                {activity.faq}
              </p>
            </div>
          </section>
        )}

        {/* Inscripción */}
        {activity.enlace_inscripcion && (
          <section className="pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto rounded-3xl bg-vc-blue-dark text-white p-8 md:p-10 text-center">
              <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black uppercase tracking-tight">
                ¿Te gustaría participar?
              </h2>
              <p className="mt-3 text-lg text-white/80">
                Reserva tu lugar en esta actividad.
              </p>
              <a
                href={activity.enlace_inscripcion}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white/50 shadow-lg"
              >
                Quiero inscribirme
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </section>
        )}

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
