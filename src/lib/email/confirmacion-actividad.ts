import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/content";
import { modalidadLabel, planMeta, type Activity } from "@/lib/activities";
import type { RegistroStatus } from "@/lib/registrations";
import { googleCalendarUrl, icsDe, icsFilename } from "@/lib/calendario";
import { LOGO_BLANCO_PNG_BASE64 } from "@/lib/email/logo";

/**
 * Correo de confirmación de inscripción a una actividad (Resend).
 *
 * Remitente: EMAIL_FROM. Mientras no haya dominio verificado en Resend se usa
 * `onboarding@resend.dev`, que SOLO entrega al correo dueño de la cuenta de
 * Resend: sirve para probar, no para socias reales. Para producción hay que
 * verificar vivircreciendo.com en Resend y poner p. ej.
 * EMAIL_FROM="Vivir Creciendo <hola@vivircreciendo.com>".
 *
 * Nunca lanza: si el correo falla, la inscripción ya quedó hecha y no se le
 * puede mostrar un error a la persona por eso. Se registra en el log.
 */

const FROM = process.env.EMAIL_FROM || "Vivir Creciendo <onboarding@resend.dev>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || siteConfig.email;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Texto con saltos de línea → HTML seguro. */
function parrafo(s: string): string {
  return esc(s).replace(/\n/g, "<br>");
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://vivircreciendo.com").replace(/\/$/, "");
}

const INTRO: Record<RegistroStatus, string> = {
  gratuita: "Tu lugar en esta actividad gratuita quedó reservado.",
  membresia: "Tu lugar quedó reservado como parte de tu membresía.",
  prueba: "Tu lugar quedó reservado. Esta es tu actividad de prueba: disfrútala.",
  already: "Tu lugar quedó reservado.",
};

export function armarCorreoConfirmacion(input: {
  nombre: string | null;
  activity: Activity;
  status: RegistroStatus;
}): { subject: string; html: string; text: string; ics: string | null } {
  const a = input.activity;
  const plan = planMeta(a.plan);
  const facilitador = a.facilitador_rol
    ? `${a.facilitador ?? ""}${a.facilitador ? " — " : ""}${a.facilitador_rol}`
    : a.facilitador;
  const precio = a.precio_nota
    ? `${a.precio ?? ""}${a.precio ? " · " : ""}${a.precio_nota}`
    : a.precio;
  const descripcion = a.full_description?.trim() || a.short_preview;
  const beneficios = (a.beneficios ?? "")
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);
  const enlace = a.enlace_inscripcion?.trim() || null;
  const urlActividad = `${siteUrl()}/actividades/${a.id}`;
  const saludo = input.nombre ? `Hola, ${input.nombre}:` : "Hola:";
  const google = googleCalendarUrl(a, urlActividad);

  const ficha: [string, string | null | undefined][] = [
    ["Plan", plan?.label],
    ["Fecha", a.fecha],
    ["Horario", a.hora],
    ["Frecuencia", a.frecuencia],
    ["Duración", a.duracion],
    ["Modalidad", modalidadLabel(a.modalidad)],
    ["Facilitador/a", facilitador],
    ["Precio", precio],
    ["Para quién es", a.publico_objetivo],
  ];
  const filas = ficha.filter((f): f is [string, string] => Boolean(f[1]));

  const subject = `Confirmación: ${a.title} — Vivir Creciendo`;

  // Tipografías de la página (Archivo Black / Work Sans). Apple Mail e iOS las
  // cargan; Gmail y Outlook caen a Arial Black / Helvetica, que se ven bien.
  const DISPLAY = "'Archivo Black','Arial Black',Arial,sans-serif";
  const BODY = "'Work Sans','Helvetica Neue',Helvetica,Arial,sans-serif";
  const AZUL = "#142B71";
  const AZUL_OSC = "#052D75";
  const NARANJA = "#D85A35";
  const TEXTO = "#3A3A3A";
  const SUAVE = "#7A7A7A";

  const titulo = (t: string) =>
    `<div style="font-family:${DISPLAY};font-size:15px;letter-spacing:1.5px;text-transform:uppercase;color:${AZUL_OSC};margin:0 0 14px;">${esc(t)}</div>`;

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
  @media (max-width:620px){ .px{padding-left:24px!important;padding-right:24px!important} .h1{font-size:28px!important} }
  a{color:${AZUL}}
</style>
</head>
<body style="margin:0;padding:0;background:#F7F3EE;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;">${esc(INTRO[input.status])} ${esc(a.title)}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

  <!-- Encabezado con logo -->
  <tr><td align="center" style="background:${AZUL};border-radius:20px 20px 0 0;padding:32px 24px 28px;">
    <img src="cid:logo-vc" alt="Vivir Creciendo" width="150" style="display:block;width:150px;height:auto;border:0;">
  </td></tr>
  <tr><td style="background:${NARANJA};height:5px;line-height:5px;font-size:0;">&nbsp;</td></tr>

  <!-- Saludo y título -->
  <tr><td class="px" style="background:#FFFFFF;padding:40px 48px 8px;font-family:${BODY};">
    <div style="font-family:${BODY};font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${NARANJA};margin:0 0 14px;">✓&nbsp;&nbsp;Inscripción confirmada</div>
    <h1 class="h1" style="margin:0 0 24px;font-family:${DISPLAY};font-weight:400;font-size:34px;line-height:1.1;text-transform:uppercase;color:${AZUL_OSC};">${esc(a.title)}</h1>
    <p style="margin:0 0 8px;font-size:18px;line-height:1.6;color:${TEXTO};">${esc(saludo)}</p>
    <p style="margin:0;font-size:18px;line-height:1.6;color:${TEXTO};">${esc(INTRO[input.status])} Aquí tienes todo lo que necesitas saber.</p>
  </td></tr>

  ${a.image_url ? `<tr><td class="px" style="background:#FFFFFF;padding:28px 48px 0;"><img src="${esc(a.image_url)}" alt="${esc(a.title)}" width="504" style="display:block;width:100%;max-width:504px;height:auto;border-radius:14px;border:0;"></td></tr>` : ""}

  ${enlace ? `<tr><td class="px" align="center" style="background:#FFFFFF;padding:32px 48px 0;">
    <a href="${esc(enlace)}" style="display:inline-block;background:${NARANJA};color:#FFFFFF;text-decoration:none;font-family:${BODY};font-weight:600;font-size:18px;padding:16px 36px;border-radius:12px;">Entrar a la actividad</a>
  </td></tr>` : ""}

  ${filas.length ? `<tr><td class="px" style="background:#FFFFFF;padding:36px 48px 0;font-family:${BODY};">
    ${titulo("Los detalles")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EEE7DE;">
      ${filas
        .map(
          ([k, v]) => `<tr><td style="padding:14px 0;border-bottom:1px solid #EEE7DE;">
        <div style="font-family:${BODY};font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${SUAVE};margin:0 0 4px;">${esc(k)}</div>
        <div style="font-family:${BODY};font-size:17px;line-height:1.5;color:${AZUL_OSC};">${parrafo(v)}</div>
      </td></tr>`
        )
        .join("")}
    </table>
  </td></tr>` : ""}

  <tr><td class="px" style="background:#FFFFFF;padding:36px 48px 0;font-family:${BODY};">
    ${titulo("De qué se trata")}
    <p style="margin:0;font-size:17px;line-height:1.7;color:${TEXTO};">${parrafo(descripcion)}</p>
  </td></tr>

  ${beneficios.length ? `<tr><td class="px" style="background:#FFFFFF;padding:36px 48px 0;font-family:${BODY};">
    ${titulo("Qué incluye")}
    <table role="presentation" cellpadding="0" cellspacing="0">
      ${beneficios
        .map(
          (b) => `<tr>
        <td valign="top" style="padding:4px 12px 4px 0;font-family:${BODY};font-size:17px;font-weight:600;color:${NARANJA};">✓</td>
        <td style="padding:4px 0;font-family:${BODY};font-size:17px;line-height:1.5;color:${TEXTO};">${esc(b)}</td>
      </tr>`
        )
        .join("")}
    </table>
  </td></tr>` : ""}

  ${a.faq ? `<tr><td class="px" style="background:#FFFFFF;padding:36px 48px 0;font-family:${BODY};">
    ${titulo("Preguntas frecuentes")}
    <p style="margin:0;font-size:16px;line-height:1.7;color:${TEXTO};">${parrafo(a.faq)}</p>
  </td></tr>` : ""}

  ${google ? `<tr><td class="px" style="background:#FFFFFF;padding:40px 48px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2FA;border-radius:16px;">
      <tr><td align="center" style="padding:28px 24px;font-family:${BODY};">
        <div style="font-family:${DISPLAY};font-size:18px;text-transform:uppercase;color:${AZUL_OSC};margin:0 0 6px;">Agéndala</div>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.5;color:${TEXTO};">Agrégala a tu calendario y te avisamos una hora antes.</p>
        <a href="${esc(google)}" style="display:inline-block;background:${AZUL};color:#FFFFFF;text-decoration:none;font-family:${BODY};font-weight:600;font-size:16px;padding:14px 28px;border-radius:12px;">Agregar a Google Calendar</a>
        <p style="margin:16px 0 0;font-size:14px;line-height:1.5;color:${SUAVE};">¿Usas Apple o Outlook? Abre el archivo adjunto<br><b style="color:${TEXTO};">${esc(icsFilename(a))}</b></p>
      </td></tr>
    </table>
  </td></tr>` : ""}

  <tr><td class="px" align="center" style="background:#FFFFFF;border-radius:0 0 20px 20px;padding:36px 48px 40px;font-family:${BODY};">
    <a href="${esc(urlActividad)}" style="font-size:16px;font-weight:600;color:${AZUL};">Ver la actividad en la página →</a>
  </td></tr>

  <!-- Pie -->
  <tr><td align="center" style="padding:28px 24px 8px;font-family:${BODY};font-size:14px;line-height:1.7;color:${SUAVE};">
    Puedes ver todas tus inscripciones en <a href="${siteUrl()}/perfil" style="color:${AZUL};font-weight:600;">tu perfil</a>.<br>
    ¿Dudas? Responde este correo o escríbenos a <a href="mailto:${esc(siteConfig.email)}" style="color:${AZUL};">${esc(siteConfig.email)}</a>.
  </td></tr>
  <tr><td align="center" style="padding:8px 24px 0;font-family:${BODY};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#B0A99F;">
    Vivir Creciendo · ${esc(siteConfig.brandTagline)}
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

  const text = [
    saludo,
    "",
    INTRO[input.status],
    "",
    a.title.toUpperCase(),
    "",
    ...filas.map(([k, v]) => `${k}: ${v}`),
    "",
    descripcion,
    ...(beneficios.length ? ["", "Qué incluye:", ...beneficios.map((b) => `- ${b}`)] : []),
    ...(a.faq ? ["", "Preguntas frecuentes:", a.faq] : []),
    "",
    ...(enlace ? [`Entrar a la actividad: ${enlace}`] : []),
    ...(google ? [`Agregar a Google Calendar: ${google}`, `Apple / Outlook: abre el archivo adjunto ${icsFilename(a)}`] : []),
    `Ver la actividad: ${urlActividad}`,
    `Tus inscripciones: ${siteUrl()}/perfil`,
    "",
    `¿Dudas? Escríbenos a ${siteConfig.email}.`,
  ].join("\n");

  return { subject, html, text, ics: icsDe(a, urlActividad) };
}

export async function enviarConfirmacionActividad(input: {
  to: string;
  nombre: string | null;
  activity: Activity;
  status: RegistroStatus;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[correo] Falta RESEND_API_KEY: no se envía la confirmación.");
    return;
  }
  try {
    const { subject, html, text, ics } = armarCorreoConfirmacion(input);
    const { error } = await new Resend(key).emails.send({
      from: FROM,
      to: input.to,
      replyTo: REPLY_TO,
      subject,
      html,
      text,
      attachments: [
        // Logo incrustado (cid): no depende de que el sitio esté publicado ni
        // de que el cliente de correo cargue imágenes remotas.
        {
          filename: "vivir-creciendo.png",
          content: Buffer.from(LOGO_BLANCO_PNG_BASE64, "base64"),
          contentType: "image/png",
          contentId: "logo-vc",
        },
        ...(ics
          ? [
              {
                filename: icsFilename(input.activity),
                content: Buffer.from(ics, "utf-8"),
                contentType: "text/calendar; charset=utf-8; method=PUBLISH",
              },
            ]
          : []),
      ],
    });
    if (error) console.error("[correo] Resend rechazó la confirmación:", error);
  } catch (e) {
    console.error("[correo] No se pudo enviar la confirmación:", e);
  }
}
