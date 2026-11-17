import "server-only";
import { armarHtml, boton, enviarCorreo, parrafo, siteUrl } from "@/lib/email/plantilla";
import { PLANES, type PlanKey } from "@/lib/payments/plans";

/**
 * Los tres correos automáticos (fundadoras, 17-nov-2026):
 *   1. Bienvenida, al activarse la membresía.
 *   2. Encuesta, al día siguiente de una actividad.
 *   3. Invitación a sumarse, para quien vino a una actividad gratuita o de
 *      prueba y todavía no tiene membresía.
 * Solo arman y envían; quién los recibe y cuándo lo decide
 * lib/correos-automaticos.ts (cron) y lib/payments/access.ts (bienvenida).
 */

function saludo(nombre: string | null): string {
  return nombre ? `Hola, ${nombre}:` : "Hola:";
}

export async function enviarBienvenida(input: {
  to: string;
  nombre: string | null;
  plan: PlanKey;
  primerCobro: Date | null;
}): Promise<boolean> {
  const plan = PLANES[input.plan];
  const fecha = input.primerCobro
    ? input.primerCobro.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const subject = "¡Bienvenida a Vivir Creciendo!";
  const lineas = [
    saludo(input.nombre),
    "Ya eres parte de Vivir Creciendo. Nos alegra muchísimo tenerte en la comunidad.",
    `Tu membresía ${plan.nombre.toLowerCase()} está activa: desde hoy puedes inscribirte a todas las actividades (Caminando Juntos, Cine Reflexión, Salud y Bienestar y las que vayan llegando).`,
    fecha
      ? `Los primeros días son gratis. El primer cobro (${plan.usdLabel}) será el ${fecha}; si antes decides que no es para ti, cancelas desde tu perfil y no se cobra nada.`
      : "Puedes cancelar cuando quieras desde tu perfil, sin trámites.",
    "¿Por dónde empezar? Entra a las actividades, elige la próxima y reserva tu lugar. Te llegará un correo con el link para entrar.",
  ];
  const html = armarHtml({
    subject,
    etiqueta: "✓  Membresía activa",
    titulo: "¡Bienvenida!",
    preheader: "Tu membresía ya está activa. Te esperamos en la próxima actividad.",
    cuerpo: lineas.map(parrafo).join("") + boton("Ver las actividades", `${siteUrl()}/#actividades`),
  });
  return enviarCorreo({ to: input.to, subject, html, text: lineas.join("\n\n") + `\n\nVer las actividades: ${siteUrl()}/#actividades` });
}

export async function enviarEncuesta(input: {
  to: string;
  nombre: string | null;
  actividad: string;
  token: string;
}): Promise<boolean> {
  const url = `${siteUrl()}/encuesta/${input.token}`;
  const subject = `¿Cómo la pasaste en ${input.actividad}?`;
  const lineas = [
    saludo(input.nombre),
    `Gracias por acompañarnos ayer en ${input.actividad}.`,
    "Nos encantaría saber cómo la viviste: qué te gustó, qué cambiarías y, si quieres, unas palabras tuyas que podamos compartir con otras personas que están pensando en sumarse.",
    "Son dos minutos y nos ayuda muchísimo a seguir mejorando.",
  ];
  const html = armarHtml({
    subject,
    etiqueta: "Tu opinión nos importa",
    titulo: "¿Cómo la pasaste?",
    preheader: `Dos minutos para contarnos cómo fue ${input.actividad}.`,
    cuerpo: lineas.map(parrafo).join("") + boton("Contarles cómo me fue", url),
  });
  return enviarCorreo({ to: input.to, subject, html, text: lineas.join("\n\n") + `\n\nResponder la encuesta: ${url}` });
}

export async function enviarInvitacion(input: {
  to: string;
  nombre: string | null;
  actividad: string;
  primerCobro: Date;
}): Promise<boolean> {
  const url = `${siteUrl()}/membresia`;
  const fecha = input.primerCobro.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  const subject = "Tu lugar en Vivir Creciendo sigue abierto";
  const lineas = [
    saludo(input.nombre),
    `Hace unos días compartiste con nosotras ${input.actividad}. Ojalá te hayas sentido como en casa.`,
    "Si te quedaste con ganas de más, la comunidad completa te espera: Caminando Juntos cada semana, Cine Reflexión, Salud y Bienestar, charlas con especialistas y la compañía de personas que están viviendo esta etapa como tú.",
    `Y puedes probarla sin riesgo: hoy no pagas nada, el primer cobro sería el ${fecha}, y si antes decides que no es para ti, cancelas y listo.`,
  ];
  const html = armarHtml({
    subject,
    etiqueta: "Te esperamos",
    titulo: "Súmate a la comunidad",
    preheader: "Prueba la membresía completa: hoy no pagas nada.",
    cuerpo: lineas.map(parrafo).join("") + boton("Quiero sumarme", url),
  });
  return enviarCorreo({ to: input.to, subject, html, text: lineas.join("\n\n") + `\n\nQuiero sumarme: ${url}` });
}
