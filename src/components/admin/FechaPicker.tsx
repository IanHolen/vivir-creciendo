"use client";

import { useState } from "react";
import { Plus, X, CalendarDays } from "lucide-react";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DIAS = [
  "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const inputClass =
  "w-full min-h-[52px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 text-vc-blue-dark bg-white";

/**
 * Formatea fechas ISO (YYYY-MM-DD) a texto en español, agrupando por mes.
 * Ej: [2026-07-16, 2026-07-23, 2026-07-30] → "Miércoles 16, 23 y 30 de julio".
 * Si las fechas no comparten día de semana, omite el prefijo del día.
 */
export function formatFechasES(iso: string[]): string {
  const ds = iso
    .filter(Boolean)
    .map((s) => new Date(s + "T12:00:00"))
    .sort((a, b) => a.getTime() - b.getTime());
  if (!ds.length) return "";

  const groups: { month: number; days: number[] }[] = [];
  for (const d of ds) {
    const last = groups[groups.length - 1];
    if (last && last.month === d.getMonth()) last.days.push(d.getDate());
    else groups.push({ month: d.getMonth(), days: [d.getDate()] });
  }
  const joinDays = (arr: number[]) =>
    arr.length === 1
      ? String(arr[0])
      : arr.slice(0, -1).join(", ") + " y " + arr[arr.length - 1];
  let text = groups
    .map((g) => `${joinDays(g.days)} de ${MESES[g.month]}`)
    .join("; ");

  const weekdays = new Set(ds.map((d) => d.getDay()));
  if (weekdays.size === 1) text = `${cap(DIAS[ds[0].getDay()])} ${text}`;
  return text;
}

export default function FechaPicker({ defaultValue }: { defaultValue?: string | null }) {
  const [text, setText] = useState(defaultValue ?? "");
  const [dates, setDates] = useState<string[]>([""]);

  const apply = (next: string[]) => {
    setDates(next.length ? next : [""]);
    const formatted = formatFechasES(next);
    if (formatted) setText(formatted);
  };

  return (
    <div>
      <label className="block text-base font-medium text-vc-blue-dark">
        Fecha(s) de la actividad
        {/* Fuente de verdad (texto libre, editable). El calendario la rellena. */}
        <input
          name="fecha"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Miércoles 16, 23 y 30 de julio"
          className={`mt-1 ${inputClass}`}
        />
      </label>

      <div className="mt-2 rounded-xl border border-vc-cream bg-vc-cream/30 p-4">
        <p className="flex items-center gap-2 text-sm text-vc-blue-dark/60">
          <CalendarDays className="w-4 h-4 text-vc-orange" aria-hidden="true" />
          Elige las fechas en el calendario y se escriben solas arriba. Puedes
          ajustar el texto a mano.
        </p>
        <div className="mt-3 space-y-2">
          {dates.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="date"
                value={d}
                aria-label={`Fecha ${i + 1}`}
                onChange={(e) => {
                  const next = [...dates];
                  next[i] = e.target.value;
                  apply(next);
                }}
                className={`${inputClass} max-w-[14rem]`}
              />
              {dates.length > 1 && (
                <button
                  type="button"
                  onClick={() => apply(dates.filter((_, j) => j !== i))}
                  aria-label={`Quitar fecha ${i + 1}`}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-vc-cream text-vc-blue-dark/60 hover:bg-white"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDates([...dates, ""])}
          className="mt-3 inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border-2 border-vc-orange text-vc-orange hover:bg-vc-orange hover:text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          Agregar otra fecha
        </button>
      </div>
    </div>
  );
}
