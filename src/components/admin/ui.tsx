import type { ComponentProps } from "react";

/**
 * Piezas compartidas del panel de administración.
 *
 * Todo el panel lo usan las fundadoras (65+) desde el escritorio: campos de
 * 52px de alto, texto de 18px, foco visible con anillo grueso y nada de
 * iconografía sin etiqueta. Estas constantes existen para que los cuatro
 * archivos del panel no se vayan desincronizando entre sí.
 */

export const inputClass =
  "w-full min-h-[52px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream bg-white text-vc-ink placeholder:text-vc-ink/35 focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/30";

export const labelClass = "block text-base font-semibold text-vc-blue-dark";

export const hintClass = "mt-1 text-sm text-vc-ink/55";

/** Botón naranja — la acción principal e irreversible-por-defecto de cada vista. */
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 rounded-xl bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40";

/** Botón azul — acciones secundarias con peso (crear, restablecer). */
export const btnBlue =
  "inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 rounded-xl bg-vc-blue hover:bg-vc-blue-dark text-white font-semibold text-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vc-blue/30";

/** Botón contorneado — navegación y acciones sin consecuencias. */
export const btnGhost =
  "inline-flex items-center justify-center gap-2 min-h-[52px] px-5 py-3 rounded-xl border-2 border-vc-cream bg-white hover:border-vc-blue hover:text-vc-blue text-vc-ink font-semibold text-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vc-blue/30";

/** Botón destructivo — solo detrás de una confirmación explícita. */
export const btnDanger =
  "inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400/40";

type IconType = React.ComponentType<{ className?: string }>;

/** Tarjeta blanca con título — la unidad de agrupación de todo el panel. */
export function Card({
  icon: Icon,
  title,
  hint,
  className = "",
  children,
}: {
  icon?: IconType;
  title?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`bg-white rounded-2xl border border-vc-cream shadow-sm p-6 md:p-7 ${className}`}
    >
      {title && (
        <header className="mb-5">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-vc-blue-dark">
            {Icon && (
              <Icon className="w-5 h-5 text-vc-orange shrink-0" aria-hidden="true" />
            )}
            {title}
          </h2>
          {hint && <p className={hintClass}>{hint}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

/** Campo de texto con su etiqueta y ayuda opcional. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {hint && <span className={`${hintClass} block`}>{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

/** Input de texto con el estilo del panel ya aplicado. */
export function TextInput(props: ComponentProps<"input">) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

/** Textarea con el estilo del panel ya aplicado. */
export function TextArea(props: ComponentProps<"textarea">) {
  return (
    <textarea {...props} className={`${inputClass} ${props.className ?? ""}`} />
  );
}
