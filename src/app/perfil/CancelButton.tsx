"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

/** Se bloquea mientras la cancelación viaja al proveedor (evita el doble clic). */
export default function CancelButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-red-300 disabled:opacity-60"
    >
      {pending && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
      {pending ? "Cancelando…" : "Sí, cancelar mi membresía"}
    </button>
  );
}
