import {
  Sparkles,
  CalendarDays,
  User,
  Users,
  Tag,
  HelpCircle,
  ImageIcon,
  Eye,
  ArrowUpDown,
  Save,
  Film,
  Footprints,
  HeartPulse,
  DoorOpen,
} from "lucide-react";
import FechaPicker from "@/components/admin/FechaPicker";
import HoraPicker from "@/components/admin/HoraPicker";
import {
  ACTIVITY_ICONS,
  PLAN_META,
  PLAN_ORDER,
  normalizeIcon,
  normalizePlan,
  type ActivityIcon,
} from "@/lib/activities";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  inputClass,
  labelClass,
  hintClass,
  btnPrimary,
} from "@/components/admin/ui";
import { REPETICIONES, ZONAS_HORARIAS } from "@/lib/calendario";

/** Los campos de public.activities tal como los edita el panel. */
export interface AdminActivity {
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
  frecuencia: string | null;
  icono: string | null;
  facilitador: string | null;
  facilitador_rol: string | null;
  publico_objetivo: string | null;
  precio: string | null;
  precio_nota: string | null;
  beneficios: string | null;
  enlace_inscripcion: string | null;
  faq: string | null;
  plan: string | null;
  // Calendario: undefined mientras la migración 2026-10-29 no esté aplicada.
  cal_inicio?: string | null;
  cal_zona?: string | null;
  cal_duracion_min?: number | null;
  cal_repeticion?: string | null;
}

/**
 * Fecha estructurada para "Agregar a mi calendario" (correo de confirmación,
 * perfil y página de la actividad). Separada de Fecha/Horario, que son texto
 * para leer: esta es la que entiende un calendario.
 */
function CalendarioFields({ a }: { a?: AdminActivity }) {
  return (
    <fieldset className="rounded-2xl border-2 border-vc-cream p-5 space-y-5">
      {/* Marca para el server action: estos campos existen en la base. */}
      <input type="hidden" name="cal_habilitado" value="1" />
      <legend className={`${labelClass} px-2`}>Para el calendario de las socias</legend>
      <p className={hintClass}>
        Con esto, quien se inscribe recibe el evento para agregarlo a su
        calendario (Google, Apple, Outlook) con aviso una hora antes. Si lo
        dejas en blanco, no se ofrece.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Primera sesión" hint="Día y hora en la zona de al lado.">
          <input
            type="datetime-local"
            name="cal_inicio"
            defaultValue={a?.cal_inicio?.slice(0, 16) ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Zona horaria">
          <select
            name="cal_zona"
            defaultValue={a?.cal_zona ?? "America/Mexico_City"}
            className={inputClass}
          >
            {ZONAS_HORARIAS.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Duración (minutos)">
          <input
            type="number"
            name="cal_duracion_min"
            min={5}
            max={1440}
            step={5}
            defaultValue={a?.cal_duracion_min ?? ""}
            placeholder="60"
            className={inputClass}
          />
        </Field>
        <Field label="Se repite">
          <select
            name="cal_repeticion"
            defaultValue={a?.cal_repeticion ?? "unica"}
            className={inputClass}
          >
            {REPETICIONES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </fieldset>
  );
}

/**
 * Selector de acceso: sin plan / gratuita / membresía.
 *
 * Antes eran cuatro botones (gratuita, básica, plus) heredados del esquema de
 * tres niveles que el doc eliminó. Las actividades viejas con "basica"/"plus"
 * llegan normalizadas a "membresia", así que el botón correcto aparece ya
 * marcado y al guardar se limpia el valor en la base.
 */
function PlanPicker({ current }: { current?: string | null }) {
  const cur = normalizePlan(current);
  const opts = [
    { value: "", label: "Sin definir", hint: "Todavía no lo decides." },
    ...PLAN_ORDER.map((key) => ({
      value: key,
      label: PLAN_META[key].label,
      hint: PLAN_META[key].hint,
    })),
  ];

  return (
    <fieldset>
      <legend className={labelClass}>¿Cómo se accede?</legend>
      {/* El radio queda VISIBLE (no sr-only): con el botón oculto, el único
          indicador de qué está elegido es el borde de color, y eso falla para
          quien no distingue bien los tonos. */}
      <div className="mt-2 space-y-2">
        {opts.map((o) => (
          <label
            key={o.value || "none"}
            className="flex items-start gap-3 min-h-[52px] px-4 py-3 rounded-xl border-2 border-vc-cream cursor-pointer transition-colors hover:border-vc-blue/40 has-[:checked]:border-vc-orange has-[:checked]:bg-vc-orange/5 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-vc-orange/30"
          >
            <input
              type="radio"
              name="plan"
              value={o.value}
              defaultChecked={(cur ?? "") === o.value}
              className="mt-1 w-5 h-5 accent-vc-orange shrink-0"
            />
            <span>
              <span className="block text-lg font-semibold text-vc-blue-dark">
                {o.label}
              </span>
              <span className="block text-sm text-vc-ink/55">{o.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Selector del ícono que lleva la card en la portada.
 *
 * El mapeo nombre → componente vive acá y no en `@/lib/activities`: ese módulo
 * lo importan también las server actions, y arrastrar lucide hasta ahí metería
 * el paquete de íconos donde no se dibuja nada.
 */
const ICONS: Record<ActivityIcon, typeof Film> = {
  Film,
  Footprints,
  HeartPulse,
  DoorOpen,
  Users,
  Sparkles,
};

function IconPicker({ current }: { current?: string | null }) {
  const cur = normalizeIcon(current);
  return (
    <fieldset>
      <legend className="sr-only">Ícono de la actividad</legend>
      <div className="grid grid-cols-2 gap-2">
        {ACTIVITY_ICONS.map((opt) => {
          const Icon = ICONS[opt.value];
          return (
            <label
              key={opt.value}
              className="flex items-center gap-2 min-h-[52px] px-3 py-2 rounded-xl border-2 border-vc-cream cursor-pointer transition-colors hover:border-vc-blue/40 has-[:checked]:border-vc-orange has-[:checked]:bg-vc-orange/5 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-vc-orange/30"
            >
              <input
                type="radio"
                name="icono"
                value={opt.value}
                defaultChecked={cur === opt.value}
                className="w-5 h-5 accent-vc-orange shrink-0"
              />
              <Icon
                className="w-6 h-6 text-vc-blue shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-base text-vc-blue-dark leading-tight">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Formulario de alta y edición de una actividad.
 *
 * Dos columnas en pantallas grandes: a la izquierda lo que se escribe (el
 * contenido), a la derecha lo que se decide (publicación, plan, imagen, precio,
 * orden). Antes eran ocho bloques apilados en una sola columna angosta y había
 * que scrollear el formulario entero para llegar al botón de guardar — que
 * ahora vive en una barra fija abajo.
 */
export default function ActivityForm({
  activity,
  submitLabel,
  calendarioDisponible = false,
  children,
}: {
  activity?: AdminActivity;
  submitLabel: string;
  /** false mientras la migración del calendario no esté aplicada. */
  calendarioDisponible?: boolean;
  /** Acciones extra de la barra inferior (p. ej. "Ver en el sitio"). */
  children?: React.ReactNode;
}) {
  const a = activity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-6 lg:gap-8 items-start">
      {/* ---------- Columna principal: el contenido ---------- */}
      <div className="space-y-6">
        <Card icon={Sparkles} title="Lo esencial">
          <div className="space-y-5">
            <Field label="Título">
              <TextInput
                name="title"
                defaultValue={a?.title ?? ""}
                required
                placeholder="Ej. Taller de memoria y bienestar"
              />
            </Field>
            <Field
              label="Adelanto corto"
              hint="Lo ve quien todavía no inició sesión. Una o dos líneas que enganchen."
            >
              <TextArea
                name="short_preview"
                defaultValue={a?.short_preview ?? ""}
                rows={2}
                placeholder="Una tarde para volver a poner en palabras lo que estás viviendo."
              />
            </Field>
            <Field
              label="Descripción completa"
              hint="Solo la ve quien inició sesión. Cuenta todo el detalle."
            >
              <TextArea
                name="full_description"
                defaultValue={a?.full_description ?? ""}
                rows={7}
                placeholder="De qué trata la actividad, cómo se desarrolla, qué se lleva quien participa."
              />
            </Field>
          </div>
        </Card>

        <Card
          icon={CalendarDays}
          title="Cuándo y cómo"
          hint="Tal cual quieres que lo lea la gente. Puedes dejar en blanco lo que no aplique."
        >
          <div className="space-y-5">
            <FechaPicker defaultValue={a?.fecha} />
            <HoraPicker defaultValue={a?.hora} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Frecuencia"
                hint="Cada cuánto se repite. Se ve en la card de la portada."
              >
                <TextInput
                  name="frecuencia"
                  defaultValue={a?.frecuencia ?? ""}
                  placeholder="1 vez por semana"
                />
              </Field>
              <Field label="Duración">
                <TextInput
                  name="duracion"
                  defaultValue={a?.duracion ?? ""}
                  placeholder="3 sesiones en vivo de 90 min c/u"
                />
              </Field>
              <Field label="Modalidad">
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
              </Field>
            </div>
            {calendarioDisponible && <CalendarioFields a={a} />}
          </div>
        </Card>

        <Card icon={User} title="Quién la dirige">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Facilitador/a">
              <TextInput
                name="facilitador"
                defaultValue={a?.facilitador ?? ""}
                placeholder="Abigail Sosa Mendoza"
              />
            </Field>
            <Field label="Rol o credenciales">
              <TextInput
                name="facilitador_rol"
                defaultValue={a?.facilitador_rol ?? ""}
                placeholder="Psicóloga · especialista en adultos mayores"
              />
            </Field>
          </div>
        </Card>

        <Card icon={Users} title="Para quién y qué incluye">
          <div className="space-y-5">
            <Field label="Público al que va dirigida">
              <TextInput
                name="publico_objetivo"
                defaultValue={a?.publico_objetivo ?? ""}
                placeholder="Personas de 65 años en adelante que quieran ejercitar la memoria"
              />
            </Field>
            <Field label="Qué incluye" hint="Una cosa por línea.">
              <TextArea
                name="beneficios"
                defaultValue={a?.beneficios ?? ""}
                rows={4}
                placeholder={"Grupo de WhatsApp\nGuía en PDF\nGrabación de las sesiones"}
              />
            </Field>
          </div>
        </Card>

        <Card
          icon={HelpCircle}
          title="Preguntas frecuentes"
          hint="Opcional. Cada pregunta con su respuesta, una por línea."
        >
          <TextArea
            name="faq"
            aria-label="Preguntas frecuentes"
            defaultValue={a?.faq ?? ""}
            rows={5}
            placeholder={
              "¿Necesito experiencia previa? No, es para todos los niveles.\n¿Quedan grabadas? Sí, recibes la grabación."
            }
          />
        </Card>
      </div>

      {/* ---------- Columna lateral: las decisiones ---------- */}
      <div className="space-y-6 lg:sticky lg:top-6">
        <Card icon={Eye} title="Publicación">
          <div className="space-y-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={a?.is_active ?? true}
                className="mt-1 w-6 h-6 accent-vc-orange shrink-0"
              />
              <span>
                <span className="block text-lg font-semibold text-vc-blue-dark">
                  Visible en la página
                </span>
                <span className={hintClass}>
                  Si lo desmarcas, la actividad se guarda pero nadie la ve.
                </span>
              </span>
            </label>
            <PlanPicker current={a?.plan} />
          </div>
        </Card>

        <Card
          icon={Sparkles}
          title="Ícono"
          hint="El dibujito que acompaña a esta actividad en la portada."
        >
          <IconPicker current={a?.icono} />
        </Card>

        <Card icon={ImageIcon} title="Imagen">
          {a?.image_url ? (
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.image_url}
                alt={`Imagen actual de ${a.title}`}
                className="w-full aspect-[4/3] object-cover rounded-xl border border-vc-cream"
              />
              <p className={hintClass}>
                Imagen actual. Sube una nueva para reemplazarla.
              </p>
            </div>
          ) : (
            <p className={`${hintClass} mb-3 mt-0`}>
              Todavía no tiene imagen.
            </p>
          )}
          <input
            name="image"
            type="file"
            accept="image/*"
            aria-label="Subir imagen de la actividad"
            className="block w-full text-base text-vc-ink file:mr-4 file:min-h-[44px] file:px-5 file:py-2 file:rounded-xl file:border-0 file:bg-vc-cream file:text-vc-blue-dark file:font-semibold hover:file:bg-vc-cream/60 file:cursor-pointer"
          />
          <p className={hintClass}>JPG o PNG, máximo 5 MB.</p>
        </Card>

        <Card icon={Tag} title="Precio e inscripción">
          <div className="space-y-5">
            <Field label="Precio">
              <TextInput
                name="precio"
                defaultValue={a?.precio ?? ""}
                placeholder="USD 85"
              />
            </Field>
            <Field label="Nota del precio">
              <TextInput
                name="precio_nota"
                defaultValue={a?.precio_nota ?? ""}
                placeholder="Precio especial hasta el 3 de julio"
              />
            </Field>
            <Field label="Enlace de inscripción">
              <TextInput
                name="enlace_inscripcion"
                type="url"
                defaultValue={a?.enlace_inscripcion ?? ""}
                placeholder="https://..."
              />
            </Field>
          </div>
        </Card>

        <Card
          icon={ArrowUpDown}
          title="Orden"
          hint="El orden también se cambia desde el listado, arrastrando la fila o con las flechas. Déjalo como está si no estás segura."
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Semana">
              <TextInput
                name="week"
                type="number"
                defaultValue={a?.week ?? ""}
              />
            </Field>
            <Field label="Posición">
              <TextInput
                name="sort_order"
                type="number"
                defaultValue={a?.sort_order ?? ""}
              />
            </Field>
          </div>
        </Card>
      </div>

      {/* ---------- Barra de guardado, siempre a la vista ---------- */}
      <div className="lg:col-span-2 sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-vc-cream/95 backdrop-blur border-t border-vc-cream flex flex-wrap items-center gap-3">
        <button type="submit" className={btnPrimary}>
          <Save className="w-5 h-5" aria-hidden="true" />
          {submitLabel}
        </button>
        {children}
      </div>
    </div>
  );
}
