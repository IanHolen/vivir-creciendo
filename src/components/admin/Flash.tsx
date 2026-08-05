"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

/**
 * Mensaje de resultado tras una acción (?ok= / ?error=).
 *
 * Vive en el layout para que las tres vistas del panel lo hereden, y por eso
 * lee los parámetros con useSearchParams: los layouts no reciben searchParams
 * como prop. Va envuelto en <Suspense> por el mismo motivo de siempre — el
 * hook fuerza render dinámico del subárbol.
 *
 * Se puede cerrar: los mensajes quedan pegados en la URL y si no hubiera forma
 * de sacarlos, "Cambios guardados" seguiría ahí media hora después.
 */
export default function Flash() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const ok = params.get("ok");
  const error = params.get("error");
  if (!ok && !error) return null;

  const dismiss = () => router.replace(pathname, { scroll: false });

  const isError = Boolean(error);
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`mb-8 flex items-start gap-3 rounded-2xl border px-5 py-4 text-lg ${
        isError
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-green-50 border-green-200 text-green-900"
      }`}
    >
      <Icon className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="flex-1">
        {isError ? <>No se pudo guardar: {error}</> : ok}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar mensaje"
        className="shrink-0 -m-2 p-2 rounded-lg hover:bg-black/5"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
