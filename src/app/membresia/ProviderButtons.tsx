"use client";

import { useFormStatus } from "react-dom";
import { Loader2, ArrowRight } from "lucide-react";

/**
 * Los dos botones de pago. Son `submit` del mismo formulario, con
 * name="proveedor" distinto; el server action lee cuál se pulsó.
 *
 * Cliente solo por `useFormStatus`: mientras se crea la suscripción en el
 * proveedor (1-3 s) los botones se bloquean y muestran "Abriendo…", para que
 * nadie pulse dos veces y termine con dos suscripciones.
 */
export default function ProviderButtons({
  paypal,
  mercadopago,
}: {
  paypal: boolean;
  mercadopago: boolean;
}) {
  const { pending } = useFormStatus();

  const base =
    "w-full inline-flex items-center justify-center gap-3 min-h-[64px] px-6 py-4 rounded-xl font-semibold text-lg transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        type="submit"
        name="proveedor"
        value="paypal"
        disabled={pending || !paypal}
        className={`${base} bg-[#003087] hover:bg-[#00236A] text-white shadow-lg`}
      >
        {pending ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Abriendo…" : "Pagar con PayPal"}
        {!pending && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
      </button>

      <button
        type="submit"
        name="proveedor"
        value="mercadopago"
        disabled={pending || !mercadopago}
        title={mercadopago ? undefined : "Muy pronto"}
        className={`${base} bg-[#009EE3] hover:bg-[#0081BA] text-white shadow-lg`}
      >
        {pending ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Abriendo…" : mercadopago ? "Pagar con Mercado Pago" : "Mercado Pago · muy pronto"}
        {!pending && mercadopago && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
      </button>
    </div>
  );
}
