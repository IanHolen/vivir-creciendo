import "server-only";
import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { enviarBienvenida, enviarEncuesta, enviarInvitacion } from "@/lib/email/automaticos";
import { fechaPrimerCobro, type PlanKey } from "@/lib/payments/plans";

/**
 * Quién recibe cada correo automático y cuándo (fundadoras, 17-nov-2026).
 *
 * Corre una vez al día desde /api/cron/correos (Vercel Cron) y es idempotente:
 * cada envío queda anotado en `correos_enviados` con (persona, tipo, motivo),
 * así que volver a correrlo no manda nada dos veces.
 *
 *   ENCUESTA     al día siguiente de la primera sesión a la que la persona se
 *                inscribió. Una por inscripción, no por semana: a quien va a
 *                Caminando Juntos cada semana no se le pregunta cada semana.
 *   INVITACIÓN   tres días después de esa sesión, solo a quien vino a una
 *                actividad gratuita o de prueba y sigue sin membresía.
 *   BIENVENIDA   no pasa por acá: la dispara la activación de la suscripción
 *                (lib/payments/access.ts) y usa `bienvenidaSiHaceFalta`.
 *
 * Las sesiones se calculan con cal_inicio / cal_repeticion / cal_duracion_min
 * de la actividad (zona cal_zona). Sin cal_inicio no hay forma de saber cuándo
 * fue, y no se manda nada.
 */

const HORAS_ENCUESTA = 20; // "al día siguiente" con un cron diario
const HORAS_INVITACION = 72;
const DIAS_MAXIMO = 21; // no desenterrar sesiones viejas al estrenar el cron

interface ActividadCal {
  id: string;
  title: string;
  plan: string | null;
  cal_inicio: string | null;
  cal_zona: string | null;
  cal_duracion_min: number | null;
  cal_repeticion: string | null;
}

/** Instante UTC de una hora de pared en una zona IANA. */
function instanteEnZona(fechaLocal: Date, zona: string): Date {
  const utcGuess = new Date(
    Date.UTC(
      fechaLocal.getUTCFullYear(),
      fechaLocal.getUTCMonth(),
      fechaLocal.getUTCDate(),
      fechaLocal.getUTCHours(),
      fechaLocal.getUTCMinutes()
    )
  );
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zona,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(utcGuess);
  const g = (t: string) => Number(partes.find((p) => p.type === t)?.value ?? "0");
  const comoSiFueraUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"));
  const offset = comoSiFueraUtc - utcGuess.getTime();
  return new Date(utcGuess.getTime() - offset);
}

/** Sesiones (inicio UTC) de la actividad entre `desde` y `hasta`. */
export function sesionesEntre(a: ActividadCal, desde: Date, hasta: Date): Date[] {
  if (!a.cal_inicio) return [];
  // cal_inicio viene "sin zona": se interpreta como hora de pared en cal_zona.
  const pared = new Date(a.cal_inicio.replace(" ", "T") + (a.cal_inicio.endsWith("Z") ? "" : "Z"));
  const zona = a.cal_zona || "America/Mexico_City";
  const primera = instanteEnZona(pared, zona);
  const out: Date[] = [];
  if (a.cal_repeticion === "semanal") {
    for (let t = primera.getTime(); t <= hasta.getTime(); t += 7 * 86400000) {
      if (t >= desde.getTime()) out.push(new Date(t));
    }
  } else if (a.cal_repeticion === "mensual") {
    // Mismo n-ésimo día de la semana de cada mes (igual que el .ics).
    const n = Math.floor((pared.getUTCDate() - 1) / 7);
    const dow = pared.getUTCDay();
    for (let m = 0; m < 48; m++) {
      const base = new Date(Date.UTC(pared.getUTCFullYear(), pared.getUTCMonth() + m, 1, pared.getUTCHours(), pared.getUTCMinutes()));
      const primerDow = base.getUTCDay();
      const dia = 1 + ((dow - primerDow + 7) % 7) + n * 7;
      const paredM = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), dia, pared.getUTCHours(), pared.getUTCMinutes()));
      if (paredM.getUTCMonth() !== base.getUTCMonth()) continue;
      const t = instanteEnZona(paredM, zona).getTime();
      if (t > hasta.getTime()) break;
      if (t >= desde.getTime() && t >= primera.getTime()) out.push(new Date(t));
    }
  } else if (primera >= desde && primera <= hasta) {
    out.push(primera);
  }
  return out;
}

interface Inscripcion {
  id: string;
  user_id: string;
  activity_id: string;
  es_prueba: boolean | null;
  plan_snapshot: string | null;
  created_at: string;
}

function token(): string {
  return randomBytes(18).toString("base64url");
}

export async function correrCorreosAutomaticos(ahora = new Date()): Promise<{
  encuestas: number;
  invitaciones: number;
  omitidos: number;
}> {
  const db = createAdminClient();
  const desde = new Date(ahora.getTime() - DIAS_MAXIMO * 86400000);

  const [{ data: acts }, { data: regs }] = await Promise.all([
    db.from("activities").select("id,title,plan,cal_inicio,cal_zona,cal_duracion_min,cal_repeticion").not("cal_inicio", "is", null),
    db.from("activity_registrations").select("id,user_id,activity_id,es_prueba,plan_snapshot,created_at").gte("created_at", new Date(desde.getTime() - 60 * 86400000).toISOString()),
  ]);
  const actividades = new Map(((acts ?? []) as ActividadCal[]).map((a) => [a.id, a]));
  const inscripciones = (regs ?? []) as Inscripcion[];

  // Perfiles (correo, nombre, membresía) de todas las personas implicadas.
  const userIds = [...new Set(inscripciones.map((r) => r.user_id))];
  const { data: perfiles } = userIds.length
    ? await db.from("profiles").select("id,email,full_name,membership_id").in("id", userIds)
    : { data: [] };
  const perfil = new Map(((perfiles ?? []) as { id: string; email: string | null; full_name: string | null; membership_id: number | null }[]).map((p) => [p.id, p]));

  const { data: yaEnviados } = await db.from("correos_enviados").select("user_id,tipo,referencia");
  const enviados = new Set(((yaEnviados ?? []) as { user_id: string; tipo: string; referencia: string }[]).map((c) => `${c.user_id}|${c.tipo}|${c.referencia}`));

  let encuestas = 0, invitaciones = 0, omitidos = 0;

  for (const r of inscripciones) {
    const a = actividades.get(r.activity_id);
    const p = perfil.get(r.user_id);
    if (!a || !p?.email) { omitidos++; continue; }

    // Primera sesión posterior a la inscripción.
    const sesiones = sesionesEntre(a, new Date(r.created_at), ahora);
    const sesion = sesiones[0];
    if (!sesion) continue;
    const fin = new Date(sesion.getTime() + (a.cal_duracion_min ?? 60) * 60000);
    if (fin < desde) continue; // demasiado vieja
    const horas = (ahora.getTime() - fin.getTime()) / 3600000;
    const ref = `${a.id}:${sesion.toISOString().slice(0, 10)}`;

    // 1) Encuesta
    const kEnc = `${r.user_id}|encuesta|${ref}`;
    if (horas >= HORAS_ENCUESTA && !enviados.has(kEnc)) {
      const tk = token();
      const { error } = await db.from("encuestas").insert({
        token: tk,
        user_id: r.user_id,
        activity_id: a.id,
        activity_title: a.title,
      });
      if (!error) {
        const ok = await enviarEncuesta({ to: p.email, nombre: p.full_name, actividad: a.title, token: tk });
        if (ok) {
          await db.from("correos_enviados").insert({ user_id: r.user_id, tipo: "encuesta", referencia: ref });
          enviados.add(kEnc);
          encuestas++;
        }
      }
    }

    // 2) Invitación a sumarse (solo gratuita/prueba y sin membresía)
    const vinoDeGratis = Boolean(r.es_prueba) || r.plan_snapshot === "gratuita" || a.plan === "gratuita";
    const kInv = `${r.user_id}|invitacion|${ref}`;
    const yaInvitado = [...enviados].some((k) => k.startsWith(`${r.user_id}|invitacion|`));
    if (vinoDeGratis && !p.membership_id && horas >= HORAS_INVITACION && !enviados.has(kInv) && !yaInvitado) {
      const ok = await enviarInvitacion({ to: p.email, nombre: p.full_name, actividad: a.title, primerCobro: fechaPrimerCobro(ahora) });
      if (ok) {
        await db.from("correos_enviados").insert({ user_id: r.user_id, tipo: "invitacion", referencia: ref });
        enviados.add(kInv);
        invitaciones++;
      }
    }
  }

  return { encuestas, invitaciones, omitidos };
}

/**
 * Correo de bienvenida al activarse una suscripción. Idempotente por
 * suscripción. Nunca lanza: una falla de correo no puede romper un webhook.
 */
export async function bienvenidaSiHaceFalta(input: {
  userId: string;
  providerSubId: string;
  plan: PlanKey;
  primerCobro: Date | null;
}): Promise<void> {
  try {
    const db = createAdminClient();
    const { data: p } = await db.from("profiles").select("email,full_name").eq("id", input.userId).maybeSingle();
    if (!p?.email) return;
    const { error } = await db
      .from("correos_enviados")
      .insert({ user_id: input.userId, tipo: "bienvenida", referencia: input.providerSubId });
    if (error) return; // ya se mandó (unique) u otro problema: no repetir
    const ok = await enviarBienvenida({ to: p.email, nombre: p.full_name, plan: input.plan, primerCobro: input.primerCobro });
    if (!ok) {
      await db.from("correos_enviados").delete().eq("user_id", input.userId).eq("tipo", "bienvenida").eq("referencia", input.providerSubId);
    }
  } catch (e) {
    console.error("[bienvenida] no se pudo enviar:", e);
  }
}
