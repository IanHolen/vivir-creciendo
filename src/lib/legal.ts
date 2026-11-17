/**
 * Datos que aparecen en /terminos y /privacidad.
 *
 * PENDIENTE fundadoras: completar NOMBRE LEGAL y PAÍS. Hasta entonces los
 * placeholders se ven entre corchetes a propósito, para que nadie los tome
 * por definitivos.
 */
import { siteConfig } from "@/lib/content";

export const legal = {
  titular: "[NOMBRE LEGAL DE LA TITULAR]",
  pais: "[PAÍS]",
  // Mismo correo que el resto del sitio: se cambia solo en siteConfig.email.
  email: siteConfig.email,
  actualizado: "17 de noviembre de 2026",
};
