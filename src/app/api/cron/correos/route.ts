import { NextResponse, type NextRequest } from "next/server";
import { correrCorreosAutomaticos } from "@/lib/correos-automaticos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Lo llama Vercel Cron una vez al día (vercel.json). Vercel manda
 * `Authorization: Bearer ${CRON_SECRET}` cuando esa variable existe; sin ella
 * no se acepta ninguna llamada, para que nadie dispare correos desde afuera.
 */
export async function GET(req: NextRequest) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || req.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }
  const resultado = await correrCorreosAutomaticos();
  return NextResponse.json({ ok: true, ...resultado });
}
