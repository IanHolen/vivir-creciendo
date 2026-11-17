"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

/**
 * Botón de envío de un formulario de acción del panel.
 *
 * Mientras la acción corre, se bloquea y muestra un giro con el texto
 * `pendiente` ("Ocultando…", "Guardando…"), para que se note que se apretó y
 * nadie lo vuelva a pulsar. Pedido de las fundadoras (17-nov-2026): los
 * botones de ocultar/eliminar "no se notaba que se estaban apretando".
 *
 * Solo funciona dentro de un <form action={…}>: usa useFormStatus.
 */
export default function BotonAccion({
  pendiente,
  children,
  className = "",
  ...rest
}: ComponentProps<"button"> & { pendiente: string; children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      {...rest}
      type="submit"
      disabled={pending || rest.disabled}
      aria-busy={pending || undefined}
      className={`${className} ${pending ? "cursor-wait" : ""} disabled:opacity-60 active:scale-[0.98] transition-transform`}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          {pendiente}
        </>
      ) : (
        children
      )}
    </button>
  );
}
