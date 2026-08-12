import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { MEDIA_SLOTS, findSlot, type MediaAsset, type ResolvedSlot } from "@/lib/media";

/**
 * Lecturas de multimedia contra la base.
 *
 * Están separadas de `media.ts` por una razón concreta y no por gusto: ese
 * módulo lo importa el subidor, que es un componente de cliente, y arrastrar
 * hasta el navegador el cliente de Supabase de servidor (que usa
 * `next/headers`) rompe la compilación. En `media.ts` quedó lo que pueden
 * compartir cliente y servidor —tipos, constantes y el catálogo de ranuras— y
 * acá, solo lo que toca la base.
 */

type SiteMediaRow = {
  slot: string;
  alt: string | null;
  media_id: string | null;
  media: { id: string; url: string; kind: string } | null;
};

/**
 * Resuelve TODAS las ranuras de una vez.
 *
 * Envuelta en `cache()` de React: en la portada la llaman el Hero y la sección
 * Nosotras por separado, y sin esto serían dos consultas idénticas por render.
 * Con el envoltorio, cada componente la pide cuando la necesita y la base se
 * consulta una sola vez por petición.
 */
export const getSiteMedia = cache(async function getSiteMedia(): Promise<
  Record<string, ResolvedSlot>
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_media")
    .select("slot, alt, media_id, media:media_assets(id, url, kind)");

  const rows = (data ?? []) as unknown as SiteMediaRow[];
  const byKey = new Map(rows.map((r) => [r.slot, r]));

  const out: Record<string, ResolvedSlot> = {};
  for (const slot of MEDIA_SLOTS) {
    const row = byKey.get(slot.key);
    const asignada = row?.media?.url ?? null;
    out[slot.key] = {
      slot,
      url: asignada ?? slot.fallback,
      alt: row?.alt?.trim() || slot.fallbackAlt || slot.label,
      desdeBiblioteca: asignada != null,
      mediaId: row?.media?.id ?? null,
      objectPosition: slot.objectPosition ?? "",
    };
  }
  return out;
});

/** La biblioteca completa, lo más nuevo primero. */
export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as MediaAsset[];
}

/**
 * Dónde está usado cada archivo, para poder avisarlo antes de borrar.
 * Devuelve `id del archivo -> lista de lugares en texto`.
 */
export async function getMediaUsage(): Promise<Record<string, string[]>> {
  const supabase = await createClient();
  const [slots, testimonios] = await Promise.all([
    supabase.from("site_media").select("slot, media_id"),
    supabase
      .from("testimonios_video")
      .select("nombre, video_media_id, poster_media_id"),
  ]);

  const usage: Record<string, string[]> = {};
  const push = (id: string | null, label: string) => {
    if (!id) return;
    (usage[id] ??= []).push(label);
  };

  for (const row of slots.data ?? []) {
    const s = findSlot(row.slot as string);
    push(row.media_id as string | null, s ? s.label : (row.slot as string));
  }
  for (const t of testimonios.data ?? []) {
    push(t.video_media_id as string | null, `Testimonio de ${t.nombre}`);
    push(
      t.poster_media_id as string | null,
      `Portada del testimonio de ${t.nombre}`
    );
  }
  return usage;
}
