"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

const inputClass =
  "w-full min-h-[52px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 text-vc-blue-dark bg-white";

export default function HoraPicker({ defaultValue }: { defaultValue?: string | null }) {
  const [text, setText] = useState(defaultValue ?? "");
  const [time, setTime] = useState("");

  const apply = (val: string) => {
    setTime(val);
    if (val) {
      const [hh, mm] = val.split(":");
      setText(`${hh}:${mm} hs (hora de México)`);
    }
  };

  return (
    <div>
      <label className="block text-base font-medium text-vc-blue-dark">
        Horario
        {/* Fuente de verdad (texto libre): puedes agregar otras zonas a mano. */}
        <input
          name="hora"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="10:00 hs (hora de México)"
          className={`mt-1 ${inputClass}`}
        />
      </label>

      <div className="mt-2 rounded-xl border border-vc-cream bg-vc-cream/30 p-4 flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-2 text-sm text-vc-blue-dark/60">
          <Clock className="w-4 h-4 text-vc-orange" aria-hidden="true" />
          Elige la hora:
        </span>
        <input
          type="time"
          value={time}
          aria-label="Hora de México"
          onChange={(e) => apply(e.target.value)}
          className={`${inputClass} max-w-[10rem]`}
        />
        <span className="text-sm text-vc-blue-dark/50">hora de México</span>
      </div>
    </div>
  );
}
