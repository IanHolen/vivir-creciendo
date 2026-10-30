import type { Activity } from "@/lib/activities";

/**
 * "Agregar a mi calendario" para una actividad.
 *
 * Dos salidas a partir de los mismos datos:
 *  · un archivo .ics (iCalendar) — lo abren Apple Calendar, Outlook y Google;
 *    va adjunto en el correo de confirmación y se descarga desde la página;
 *  · un enlace a Google Calendar con el evento ya cargado (un clic).
 *
 * La fuente son los campos estructurados `cal_*` (ver
 * supabase/migrations/20261029_activities_calendario.sql), no `fecha`/`hora`,
 * que son texto libre para leer ("16 hs CDMX · 19 hs Argentina") y no se
 * pueden convertir a un evento de forma fiable. Sin `cal_inicio` no hay
 * calendario: la UI simplemente no ofrece el botón.
 *
 * La hora se guarda como hora local de `cal_zona` y se publica con TZID, así
 * el calendario de cada persona la convierte a su propia zona (y las
 * repeticiones respetan los cambios de horario de verano).
 *
 * Módulo puro (sin server-only): solo arma texto.
 */

export type Repeticion = "unica" | "semanal" | "mensual";

export const ZONAS_HORARIAS = [
  { value: "America/Mexico_City", label: "Ciudad de México" },
  { value: "America/Argentina/Buenos_Aires", label: "Argentina" },
  { value: "America/Santiago", label: "Chile" },
  { value: "America/Bogota", label: "Colombia / Perú" },
  { value: "America/Los_Angeles", label: "California" },
  { value: "America/New_York", label: "Nueva York / Miami" },
  { value: "Europe/Madrid", label: "España" },
] as const;

export const REPETICIONES: { value: Repeticion; label: string }[] = [
  { value: "unica", label: "Una sola vez" },
  { value: "semanal", label: "Cada semana" },
  { value: "mensual", label: "Cada mes (mismo día de la semana)" },
];

interface Momento {
  y: number;
  m: number; // 1-12
  d: number;
  h: number;
  min: number;
}

export interface EventoCalendario {
  inicio: Momento;
  fin: Momento;
  zona: string;
  /** Regla RRULE sin el prefijo "RRULE:", o null si es única. */
  rrule: string | null;
}

/** "2026-11-05T16:00:00" (como lo devuelve PostgREST) → partes. */
function parseLocal(s: string): Momento | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(s);
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3], h: +m[4], min: +m[5] };
}

/** Suma minutos sobre la hora de pared (no hay zonas en juego acá). */
function sumarMinutos(t: Momento, minutos: number): Momento {
  const x = new Date(Date.UTC(t.y, t.m - 1, t.d, t.h, t.min) + minutos * 60_000);
  return {
    y: x.getUTCFullYear(),
    m: x.getUTCMonth() + 1,
    d: x.getUTCDate(),
    h: x.getUTCHours(),
    min: x.getUTCMinutes(),
  };
}

/** Duración en minutos: el campo numérico, o el primer número de "60-75 minutos". */
function duracionMin(a: Activity): number {
  if (a.cal_duracion_min && a.cal_duracion_min > 0) return a.cal_duracion_min;
  const n = Number(/\d+/.exec(a.duracion ?? "")?.[0]);
  return n >= 5 && n <= 600 ? n : 60;
}

const DIAS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function rruleDe(rep: string | null | undefined, inicio: Momento): string | null {
  if (rep === "semanal") return "FREQ=WEEKLY";
  if (rep === "mensual") {
    // "El segundo martes de cada mes", no "el día 10": así se agendan los
    // encuentros de una comunidad. Si cae en la 5.ª semana, "el último".
    const dow = DIAS[new Date(Date.UTC(inicio.y, inicio.m - 1, inicio.d)).getUTCDay()];
    const n = Math.ceil(inicio.d / 7);
    return `FREQ=MONTHLY;BYDAY=${n >= 5 ? -1 : n}${dow}`;
  }
  return null;
}

export function eventoDe(a: Activity): EventoCalendario | null {
  if (!a.cal_inicio) return null;
  const inicio = parseLocal(a.cal_inicio);
  if (!inicio) return null;
  return {
    inicio,
    fin: sumarMinutos(inicio, duracionMin(a)),
    zona: a.cal_zona || "America/Mexico_City",
    rrule: rruleDe(a.cal_repeticion, inicio),
  };
}

const p2 = (n: number) => String(n).padStart(2, "0");
const fmt = (t: Momento) => `${t.y}${p2(t.m)}${p2(t.d)}T${p2(t.h)}${p2(t.min)}00`;

/** Escapa texto según RFC 5545 (\ ; , y saltos de línea). */
function escIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Corta líneas a 75 octetos (RFC 5545 §3.1) sin partir caracteres UTF-8. */
function plegar(linea: string): string {
  const out: string[] = [];
  let actual = "";
  let bytes = 0;
  for (const ch of linea) {
    const b = Buffer.byteLength(ch);
    const limite = out.length === 0 ? 75 : 74; // las de continuación llevan un espacio
    if (bytes + b > limite) {
      out.push(actual);
      actual = "";
      bytes = 0;
    }
    actual += ch;
    bytes += b;
  }
  out.push(actual);
  return out.join("\r\n ");
}

function stampUtc(d = new Date()): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Texto que acompaña al evento: descripción + enlaces. */
function detalle(a: Activity, urlActividad: string): string {
  const partes = [a.full_description?.trim() || a.short_preview];
  if (a.enlace_inscripcion) partes.push(`Enlace para entrar: ${a.enlace_inscripcion}`);
  partes.push(`Detalle: ${urlActividad}`);
  return partes.join("\n\n");
}

export function icsDe(a: Activity, urlActividad: string): string | null {
  const ev = eventoDe(a);
  if (!ev) return null;
  const lugar = a.enlace_inscripcion || (a.modalidad === "online" ? "Online" : "");
  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vivir Creciendo//Actividades//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    // UID estable: si la persona lo agrega dos veces, el calendario lo reemplaza.
    `UID:actividad-${a.id}@vivircreciendo.com`,
    `DTSTAMP:${stampUtc()}`,
    `DTSTART;TZID=${ev.zona}:${fmt(ev.inicio)}`,
    `DTEND;TZID=${ev.zona}:${fmt(ev.fin)}`,
    ...(ev.rrule ? [`RRULE:${ev.rrule}`] : []),
    `SUMMARY:${escIcs(`${a.title} — Vivir Creciendo`)}`,
    `DESCRIPTION:${escIcs(detalle(a, urlActividad))}`,
    ...(lugar ? [`LOCATION:${escIcs(lugar)}`] : []),
    `URL:${urlActividad}`,
    // Recordatorio una hora antes.
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escIcs(a.title)}`,
    "TRIGGER:-PT1H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lineas.map(plegar).join("\r\n") + "\r\n";
}

export function googleCalendarUrl(a: Activity, urlActividad: string): string | null {
  const ev = eventoDe(a);
  if (!ev) return null;
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `${a.title} — Vivir Creciendo`,
    dates: `${fmt(ev.inicio)}/${fmt(ev.fin)}`,
    ctz: ev.zona,
    details: detalle(a, urlActividad),
  });
  if (a.enlace_inscripcion) q.set("location", a.enlace_inscripcion);
  if (ev.rrule) q.set("recur", `RRULE:${ev.rrule}`);
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/** Nombre de archivo seguro para el .ics. */
export function icsFilename(a: Activity): string {
  const base = a.title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "actividad"}.ics`;
}

/**
 * Los enlaces que necesitan los botones de "Agregar a mi calendario", o null
 * si la actividad no tiene fecha estructurada.
 */
export function enlacesCalendario(a: Activity): { google: string | null; ics: string } | null {
  if (!eventoDe(a)) return null;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://vivircreciendo.com").replace(/\/$/, "");
  return {
    google: googleCalendarUrl(a, `${base}/actividades/${a.id}`),
    ics: `/actividades/${a.id}/calendario`,
  };
}
