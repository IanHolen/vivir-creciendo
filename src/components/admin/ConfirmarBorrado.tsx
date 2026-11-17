"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { btnDanger, btnGhost } from "@/components/admin/ui";

/**
 * Borrado en dos pasos, dentro de un <form action={…}> del panel.
 *
 *   1. "Eliminar…" → se abre una franja roja que pregunta.
 *   2. "Sí, eliminar" envía el formulario; mientras tanto el botón gira y
 *      dice "Eliminando…". "Cancelar" cierra la franja.
 *
 * Reemplaza al <details> plegable que había antes: ahí el botón rojo quedaba
 * a un clic sin aviso y, al terminar, nada confirmaba que se había borrado.
 * La confirmación de que se borró la da el mensaje verde de arriba (Flash),
 * al que redirige la acción.
 */
function Enviar({ etiqueta }: { etiqueta: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className={`${btnDanger} min-h-[44px] text-base disabled:opacity-60`}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          Eliminando…
        </>
      ) : (
        <>
          <Trash2 className="w-5 h-5" aria-hidden="true" />
          {etiqueta}
        </>
      )}
    </button>
  );
}

export default function ConfirmarBorrado({
  que,
  pregunta,
  className = "",
}: {
  /** Qué se borra, para los textos: "la voz de Virginia", "esta actividad". */
  que: string;
  /** Aviso extra opcional ("También se borran sus inscripciones."). */
  pregunta?: string;
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={`inline-flex items-center gap-2 min-h-[44px] px-3 rounded-lg text-base text-vc-ink/60 hover:text-red-700 hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-200 ${className}`}
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
        Eliminar {que}
      </button>
    );
  }

  return (
    <div
      role="alertdialog"
      aria-live="polite"
      className={`rounded-xl bg-red-50 border border-red-200 p-4 ${className}`}
    >
      <p className="text-base font-semibold text-red-900">
        ¿Eliminar {que}? Esto no se puede deshacer.
      </p>
      {pregunta && <p className="mt-1 text-sm text-red-800">{pregunta}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        <Enviar etiqueta={`Sí, eliminar ${que}`} />
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className={`${btnGhost} min-h-[44px] text-base`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
