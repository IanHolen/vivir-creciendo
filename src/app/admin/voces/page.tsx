import { Quote, Plus, ArrowUp, ArrowDown, Eye, EyeOff, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getVocesAdmin, type Voz } from "@/lib/testimonios";
import {
  guardarVoz,
  alternarVisible,
  moverItem,
  borrarItem,
} from "@/lib/testimonios-actions";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  btnPrimary,
  btnBlue,
  btnGhost,
  btnDanger,
  hintClass,
} from "@/components/admin/ui";

export const metadata = { title: "Voces de la comunidad — Vivir Creciendo" };

/**
 * /admin/voces — punto 9 de la lista de Ian (12-ago-2026).
 *
 * Las citas de la sección "Voces de la comunidad" de la portada, que ahora se
 * muestran en carrusel. Hasta acá vivían escritas a mano en `content.ts`; las
 * tres originales ya están migradas a la tabla.
 *
 * El orden de esta lista es el orden del carrusel.
 */

/** Casilla de sí/no con el estilo del panel. */
function Check({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 w-6 h-6 shrink-0 rounded border-2 border-vc-cream text-vc-orange focus-visible:ring-4 focus-visible:ring-vc-orange/30"
      />
      <span>
        <span className="block text-base font-semibold text-vc-blue-dark">
          {label}
        </span>
        {hint && <span className={hintClass}>{hint}</span>}
      </span>
    </label>
  );
}

/** Los campos, compartidos por el alta y la edición. */
function CamposVoz({ voz }: { voz?: Voz }) {
  return (
    <div className="space-y-4">
      <Field
        label="La cita"
        hint="Textual, como la dijo la persona. Es lo que se lee grande en la tarjeta."
      >
        <TextArea
          name="cita"
          rows={3}
          required
          defaultValue={voz?.cita ?? ""}
          placeholder="En Vivir Creciendo encontré un grupo tan contenedor que espero con gusto los miércoles."
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombre">
          <TextInput
            name="nombre"
            required
            defaultValue={voz?.nombre ?? ""}
            placeholder="Virginia Estela Cohan"
          />
        </Field>
        <Field
          label="Procedencia"
          hint="Se lee debajo del nombre, tal cual lo escribas."
        >
          <TextInput
            name="contexto"
            defaultValue={voz?.contexto ?? ""}
            placeholder="82 años · México · miembro de la comunidad"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Check
          name="es_miembro"
          label="Es un miembro de la comunidad"
          hint="Las de miembros se destacan con borde naranja. Las que vienen de otro ámbito (un congreso, una charla) van atenuadas y sin ese sello: dar a entender que hay más testimonios de los que hay cuesta más caro que tener pocos."
          defaultChecked={voz ? voz.es_miembro : true}
        />
        <Check
          name="is_active"
          label="Visible en la portada"
          hint="Desmarcar la esconde sin borrarla."
          defaultChecked={voz ? voz.is_active : true}
        />
      </div>
    </div>
  );
}

function FilaVoz({ voz, i, total }: { voz: Voz; i: number; total: number }) {
  return (
    <li
      className={`rounded-2xl border p-5 ${
        voz.is_active ? "bg-white border-vc-cream" : "bg-vc-cream/50 border-vc-cream"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-full bg-vc-blue-soft px-3 py-1 text-sm font-semibold text-vc-blue">
            {i + 1}º en el carrusel
          </span>
          {voz.es_miembro ? (
            <span className="rounded-full bg-vc-orange px-3 py-1 text-sm font-semibold text-white">
              Miembro
            </span>
          ) : (
            <span className="rounded-full bg-vc-ink/10 px-3 py-1 text-sm font-semibold text-vc-ink/70">
              Otra procedencia
            </span>
          )}
          {!voz.is_active && (
            <span className="rounded-full bg-vc-ink/10 px-3 py-1 text-sm font-semibold text-vc-ink/70">
              Oculta
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <form action={moverItem}>
            <input type="hidden" name="tabla" value="voces" />
            <input type="hidden" name="id" value={voz.id} />
            <input type="hidden" name="dir" value="up" />
            <button
              type="submit"
              disabled={i === 0}
              aria-label={`Subir la voz de ${voz.nombre}`}
              className="w-11 h-11 rounded-lg border-2 border-vc-cream bg-white flex items-center justify-center hover:border-vc-blue disabled:opacity-30 disabled:hover:border-vc-cream"
            >
              <ArrowUp className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>
          <form action={moverItem}>
            <input type="hidden" name="tabla" value="voces" />
            <input type="hidden" name="id" value={voz.id} />
            <input type="hidden" name="dir" value="down" />
            <button
              type="submit"
              disabled={i === total - 1}
              aria-label={`Bajar la voz de ${voz.nombre}`}
              className="w-11 h-11 rounded-lg border-2 border-vc-cream bg-white flex items-center justify-center hover:border-vc-blue disabled:opacity-30 disabled:hover:border-vc-cream"
            >
              <ArrowDown className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>
          <form action={alternarVisible}>
            <input type="hidden" name="tabla" value="voces" />
            <input type="hidden" name="id" value={voz.id} />
            <input type="hidden" name="next" value={String(!voz.is_active)} />
            <button
              type="submit"
              className={`${btnGhost} min-h-[44px] px-4 text-base`}
            >
              {voz.is_active ? (
                <>
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                  Ocultar
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" aria-hidden="true" />
                  Mostrar
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <blockquote className="mt-4 text-lg text-vc-ink leading-relaxed">
        «{voz.cita}»
      </blockquote>
      <p className="mt-2 text-base font-semibold text-vc-blue-dark">
        {voz.nombre}
        {voz.contexto && (
          <span className="font-normal text-vc-ink/60"> · {voz.contexto}</span>
        )}
      </p>

      <details className="mt-4 group">
        <summary className="cursor-pointer text-base font-semibold text-vc-blue hover:text-vc-orange">
          Editar
        </summary>
        <form action={guardarVoz} className="mt-4">
          <input type="hidden" name="id" value={voz.id} />
          <CamposVoz voz={voz} />
          <button type="submit" className={`${btnBlue} mt-4`}>
            Guardar cambios
          </button>
        </form>

        <details className="mt-5">
          <summary className="cursor-pointer text-base text-vc-ink/55 hover:text-red-700">
            Eliminar esta voz
          </summary>
          <form
            action={borrarItem}
            className="mt-2 rounded-xl bg-red-50 border border-red-200 p-3"
          >
            <input type="hidden" name="tabla" value="voces" />
            <input type="hidden" name="id" value={voz.id} />
            <button type="submit" className={`${btnDanger} min-h-[44px] text-base`}>
              Sí, eliminar la voz de {voz.nombre}
            </button>
          </form>
        </details>
      </details>
    </li>
  );
}

export default async function VocesPage() {
  await requireAdmin();
  const voces = await getVocesAdmin();
  const visibles = voces.filter((v) => v.is_active).length;

  return (
    <>
      <div>
        <h2 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
          Voces de la comunidad
        </h2>
        <p className="mt-1 text-base text-vc-ink/60">
          Las citas que giran en el carrusel de la portada. {visibles} de{" "}
          {voces.length} visibles. El orden de esta lista es el orden en que
          aparecen.
        </p>
      </div>

      <Card icon={Plus} title="Agregar una voz" className="mt-6">
        <form action={guardarVoz}>
          <CamposVoz />
          <button type="submit" className={`${btnPrimary} mt-4`}>
            <Plus className="w-5 h-5" aria-hidden="true" />
            Agregar al carrusel
          </button>
        </form>
      </Card>

      <Card icon={Quote} title={`En el carrusel (${voces.length})`} className="mt-6">
        {voces.length === 0 ? (
          <div className="py-10 text-center">
            <Inbox className="w-10 h-10 mx-auto text-vc-ink/25" aria-hidden="true" />
            <p className="mt-3 text-lg text-vc-ink/70">
              Todavía no hay voces cargadas. La sección no se muestra en la
              portada hasta que haya al menos una.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {voces.map((v, i) => (
              <FilaVoz key={v.id} voz={v} i={i} total={voces.length} />
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
