import { ShieldCheck } from "lucide-react";
import { garantia } from "@/lib/content";

/**
 * Sección 09 — La garantía (documento de las fundadoras, nov-2026).
 *
 * "El cambio que más conversiones genera": la promesa de que no hay riesgo,
 * justo después de los precios y antes de las preguntas frecuentes. El texto
 * es literal del documento. La promesa es real: los planes de PayPal y
 * Mercado Pago tienen 30 días de prueba configurados (lib/payments).
 */
export default function Garantia() {
  return (
    <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto rounded-3xl bg-vc-blue-soft border border-vc-blue/15 p-8 md:p-12 text-center">
        <span className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm">
          <ShieldCheck
            className="w-8 h-8 text-vc-orange"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
        <h2 className="mt-6 font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue-dark tracking-tight text-balance">
          {garantia.title}
        </h2>
        <div className="mt-6 space-y-2">
          {garantia.lineas.map((l) => (
            <p key={l} className="text-lg md:text-xl text-vc-ink leading-relaxed">
              {l}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
