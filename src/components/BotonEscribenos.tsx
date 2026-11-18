import { Mail } from "lucide-react";
import { siteConfig } from "@/lib/content";

/**
 * Botón "Escríbenos": abre un borrador de correo a la dirección oficial de la
 * comunidad (siteConfig.email) con asunto ya puesto.
 *
 * Pedido de las fundadoras (17-nov-2026): cada "escríbenos" / "contáctanos"
 * del sitio tiene que ser un botón que abra el correo, no un texto suelto.
 * Se usa en server y client components (no tiene estado).
 */
export function mailtoEscribenos(asunto?: string, cuerpo?: string): string {
  const params = new URLSearchParams();
  if (asunto) params.set("subject", asunto);
  if (cuerpo) params.set("body", cuerpo);
  const q = params.toString().replace(/\+/g, "%20");
  return `mailto:${siteConfig.email}${q ? `?${q}` : ""}`;
}

type Variante = "relleno" | "borde" | "claro" | "enlace";

const ESTILOS: Record<Variante, string> = {
  // Naranja relleno: para cuando es la acción principal del bloque.
  relleno:
    "inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 rounded-xl bg-vc-orange-dark text-white font-semibold text-lg hover:bg-vc-orange transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50",
  // Borde azul: acción secundaria sobre fondo claro.
  borde:
    "inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 rounded-xl border-2 border-vc-blue text-vc-blue-dark font-semibold text-lg hover:bg-vc-blue/5 transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50",
  // Translúcido: sobre fondos azul marino (CTA final).
  claro:
    "inline-flex items-center justify-center gap-3 min-h-[52px] px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:ring-4 focus-visible:ring-white text-lg",
  // Enlace: dentro de un párrafo, para no romper la lectura.
  enlace:
    "inline-flex items-center gap-1 font-semibold text-vc-blue underline underline-offset-4 hover:text-vc-blue-dark",
};

export default function BotonEscribenos({
  asunto = "Consulta sobre Vivir Creciendo",
  cuerpo,
  variante = "borde",
  className = "",
  children = "Escríbenos",
}: {
  asunto?: string;
  cuerpo?: string;
  variante?: Variante;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a href={mailtoEscribenos(asunto, cuerpo)} className={`${ESTILOS[variante]} ${className}`.trim()}>
      {variante !== "enlace" && <Mail className="w-5 h-5" aria-hidden="true" />}
      {children}
    </a>
  );
}
