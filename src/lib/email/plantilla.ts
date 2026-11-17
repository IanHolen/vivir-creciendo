import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/content";
import { LOGO_BLANCO_PNG_BASE64 } from "@/lib/email/logo";

/**
 * Plantilla y envío compartidos por los correos automáticos (bienvenida,
 * encuesta e invitación). Misma cabecera azul con logo, misma franja naranja
 * y mismos tipos que el correo de confirmación de actividad.
 *
 * Remitente: EMAIL_FROM (p. ej. "Vivir Creciendo <hola@vivircreciendo.com>",
 * con el dominio verificado en Resend). Sin RESEND_API_KEY no se envía nada y
 * se deja constancia en el log; nunca se lanza un error hacia arriba.
 */
const FROM = process.env.EMAIL_FROM || "Vivir Creciendo <onboarding@resend.dev>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || siteConfig.email;

export const DISPLAY = "'Archivo Black','Arial Black',Arial,sans-serif";
export const BODY = "'Work Sans','Helvetica Neue',Helvetica,Arial,sans-serif";
export const AZUL = "#142B71";
export const AZUL_OSC = "#052D75";
export const NARANJA = "#D85A35";
export const TEXTO = "#3A3A3A";
export const SUAVE = "#7A7A7A";

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://vivircreciendo.com").replace(/\/$/, "");
}

export function parrafo(texto: string): string {
  return `<p style="margin:0 0 16px;font-size:18px;line-height:1.6;color:${TEXTO};">${esc(texto)}</p>`;
}

export function boton(texto: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px auto 24px;"><tr><td align="center" style="background:${NARANJA};border-radius:12px;">
    <a href="${esc(href)}" style="display:inline-block;color:#FFFFFF;text-decoration:none;font-family:${BODY};font-weight:600;font-size:18px;padding:16px 36px;border-radius:12px;">${esc(texto)}</a>
  </td></tr></table>`;
}

export function armarHtml(input: {
  subject: string;
  etiqueta: string;
  titulo: string;
  preheader: string;
  cuerpo: string;
}): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(input.subject)}</title>
<style>
  @media (max-width:620px){ .px{padding-left:24px!important;padding-right:24px!important} .h1{font-size:28px!important} }
  a{color:${AZUL}}
</style>
</head>
<body style="margin:0;padding:0;background:#F7F3EE;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;">${esc(input.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td align="center" style="background:${AZUL};border-radius:20px 20px 0 0;padding:32px 24px 28px;">
    <img src="cid:logo-vc" alt="Vivir Creciendo" width="150" style="display:block;width:150px;height:auto;border:0;">
  </td></tr>
  <tr><td style="background:${NARANJA};height:5px;line-height:5px;font-size:0;">&nbsp;</td></tr>
  <tr><td class="px" style="background:#FFFFFF;padding:40px 48px 24px;font-family:${BODY};">
    <div style="font-family:${BODY};font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${NARANJA};margin:0 0 14px;">${esc(input.etiqueta)}</div>
    <h1 class="h1" style="margin:0 0 24px;font-family:${DISPLAY};font-weight:400;font-size:32px;line-height:1.15;text-transform:uppercase;color:${AZUL_OSC};">${esc(input.titulo)}</h1>
    ${input.cuerpo}
  </td></tr>
  <tr><td class="px" style="background:#FFFFFF;border-radius:0 0 20px 20px;padding:8px 48px 36px;font-family:${BODY};">
    <p style="margin:0;font-size:15px;line-height:1.6;color:${SUAVE};">Con cariño,<br><strong style="color:${AZUL_OSC};">Alejandra y Nurit</strong> · Vivir Creciendo</p>
    <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:${SUAVE};">¿Dudas? Responde a este correo o escríbenos a <a href="mailto:${esc(REPLY_TO)}" style="color:${AZUL};">${esc(REPLY_TO)}</a>.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Envía por Resend. Devuelve true si salió. Nunca lanza. */
export async function enviarCorreo(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[correo] Falta RESEND_API_KEY: no se envía "${input.subject}" a ${input.to}.`);
    return false;
  }
  try {
    const { error } = await new Resend(key).emails.send({
      from: FROM,
      to: input.to,
      replyTo: REPLY_TO,
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: [
        {
          filename: "vivir-creciendo.png",
          content: Buffer.from(LOGO_BLANCO_PNG_BASE64, "base64"),
          contentType: "image/png",
          contentId: "logo-vc",
        },
      ],
    });
    if (error) {
      console.error("[correo] Resend rechazó el envío:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[correo] No se pudo enviar:", e);
    return false;
  }
}
