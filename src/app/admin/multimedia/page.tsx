import { Image as ImageIcon, Film, Upload, LayoutTemplate, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { MEDIA_SLOTS, formatBytes, type MediaAsset } from "@/lib/media";
import {
  getMediaAssets,
  getMediaUsage,
  getSiteMedia,
} from "@/lib/media-queries";
import { actualizarArchivo, asignarRanura, borrarArchivo } from "@/lib/media-actions";
import MediaUploader from "@/components/admin/MediaUploader";
import {
  Card,
  TextInput,
  btnBlue,
  btnGhost,
  btnDanger,
  inputClass,
  labelClass,
  hintClass,
} from "@/components/admin/ui";

export const metadata = { title: "Multimedia — Vivir Creciendo" };

/**
 * /admin/multimedia — punto 3 de la lista de Ian (12-ago-2026).
 *
 * Tres bloques, en este orden a propósito:
 *
 *   1. DÓNDE SE USA (las ranuras). Es lo que casi siempre vienen a hacer:
 *      cambiar la foto de la portada o poner el video de las fundadoras. Cada
 *      ranura trae su propio botón de subir, así cambiar una foto es UN paso.
 *   2. SUBIR A LA BIBLIOTECA, para el material que todavía no tiene lugar
 *      asignado (por ejemplo, videos de testimonios).
 *   3. LA BIBLIOTECA. Todo lo subido, con su descripción y en qué lugares está
 *      puesto, para poder borrar sin romper nada sin querer.
 *
 * REORDENADO el 20-ago-2026 (Ian): el único botón de subir estaba al final de
 * la página, después de toda la biblioteca. Quien entraba veía las fotos, la
 * lista desplegable —vacía, porque no había nada subido— y el campo de
 * descripción, y se iba con la impresión de que el panel solo dejaba escribir
 * descripciones. Subir ahora está en los dos lugares donde se necesita.
 *
 * Los logos y el favicon no aparecen: se cambian por código. Un archivo mal
 * subido ahí deja el sitio entero sin logo.
 */

function Vista({
  asset,
  className = "",
}: {
  asset: { url: string; kind: string; descripcion?: string | null } | null;
  className?: string;
}) {
  if (!asset) {
    return (
      <div
        className={`flex items-center justify-center bg-vc-cream text-vc-ink/40 ${className}`}
      >
        <Inbox className="w-8 h-8" aria-hidden="true" />
      </div>
    );
  }
  if (asset.kind === "video") {
    return (
      // Sin autoplay y con metadata: cargar el video entero de cada tarjeta
      // convertiría esta pantalla en decenas de megabytes.
      <video
        src={asset.url}
        controls
        preload="metadata"
        className={`bg-black object-contain ${className}`}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.url}
      alt={asset.descripcion ?? ""}
      className={`object-cover ${className}`}
    />
  );
}

function TarjetaArchivo({
  asset,
  usos,
}: {
  asset: MediaAsset;
  usos: string[];
}) {
  return (
    <li className="bg-white rounded-2xl border border-vc-cream overflow-hidden flex flex-col">
      <Vista asset={asset} className="w-full h-44" />

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <p className="flex items-center gap-2 font-semibold text-vc-blue-dark break-all">
            {asset.kind === "video" ? (
              <Film className="w-4 h-4 shrink-0 text-vc-orange" aria-hidden="true" />
            ) : (
              <ImageIcon className="w-4 h-4 shrink-0 text-vc-orange" aria-hidden="true" />
            )}
            {asset.filename}
          </p>
          <p className={hintClass}>
            {asset.kind === "video" ? "Video" : "Foto"} · {formatBytes(asset.bytes)}
          </p>
        </div>

        {/* Dónde está puesto. Es la mitad del pedido: saber qué se rompe si se
            borra este archivo. */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-vc-ink/45">
            Dónde se usa
          </p>
          {usos.length > 0 ? (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {usos.map((u) => (
                <li
                  key={u}
                  className="rounded-full bg-vc-blue-soft px-3 py-1 text-sm font-medium text-vc-blue"
                >
                  {u}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-vc-ink/55">
              En ningún lado todavía.
            </p>
          )}
        </div>

        <form action={actualizarArchivo} className="mt-auto space-y-2">
          <input type="hidden" name="id" value={asset.id} />
          <label className="block">
            <span className="text-sm font-semibold text-vc-blue-dark">
              Descripción
            </span>
            <TextInput
              name="descripcion"
              defaultValue={asset.descripcion ?? ""}
              placeholder="Para qué es este archivo"
              className="mt-1 min-h-[44px] text-base"
            />
          </label>
          <button type="submit" className={`${btnGhost} w-full min-h-[44px] text-base`}>
            Guardar descripción
          </button>
        </form>

        {/* Borrar detrás de un <details>: HTML puro, funciona sin JavaScript, y
            hay que abrirlo a propósito. Mismo patrón que la ficha de actividad. */}
        <details className="group">
          <summary className="cursor-pointer text-base text-vc-ink/55 hover:text-red-700">
            Eliminar este archivo
          </summary>
          <div className="mt-2 rounded-xl bg-red-50 border border-red-200 p-3">
            {usos.length > 0 && (
              <p className="text-sm text-red-800">
                Está en uso en {usos.length}{" "}
                {usos.length === 1 ? "lugar" : "lugares"}. Al borrarlo, esos
                lugares vuelven a mostrar lo que traían por defecto.
              </p>
            )}
            <form action={borrarArchivo} className="mt-2">
              <input type="hidden" name="id" value={asset.id} />
              <button
                type="submit"
                className={`${btnDanger} w-full min-h-[44px] text-base`}
              >
                Sí, eliminar «{asset.filename}»
              </button>
            </form>
          </div>
        </details>
      </div>
    </li>
  );
}

export default async function MultimediaPage() {
  await requireAdmin();

  const [assets, usage, ranuras] = await Promise.all([
    getMediaAssets(),
    getMediaUsage(),
    getSiteMedia(),
  ]);

  const imagenes = assets.filter((a) => a.kind === "imagen");
  const videos = assets.filter((a) => a.kind === "video");
  const porId = new Map(assets.map((a) => [a.id, a]));

  return (
    <>
      <div>
        <h2 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
          Multimedia
        </h2>
        <p className="mt-1 text-base text-vc-ink/60">
          Todas las fotos y videos del sitio. Arriba, dónde se usa cada uno;
          abajo, la biblioteca completa. El logo y el ícono de la pestaña no
          están acá: se cambian desde el código, para que no se rompan sin
          querer.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. Las ranuras                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Card
        icon={LayoutTemplate}
        title="Dónde se usa cada archivo"
        hint="Cada lugar del sitio con su archivo. Puedes subir uno nuevo desde aquí mismo, o elegir alguno que ya esté en la biblioteca. Con «Usar el archivo por defecto» vuelve a la imagen que trae el sitio de fábrica."
        className="mt-6"
      >
        <ul className="space-y-6">
          {MEDIA_SLOTS.map((slot) => {
            const actual = ranuras[slot.key];
            const opciones = slot.kind === "video" ? videos : imagenes;
            const asignado = actual.mediaId ? porId.get(actual.mediaId) : null;

            return (
              <li
                key={slot.key}
                className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-5 pb-6 border-b border-vc-cream last:border-0 last:pb-0"
              >
                <div>
                  <Vista
                    asset={
                      actual.url
                        ? {
                            url: actual.url,
                            kind: slot.kind === "video" ? "video" : "imagen",
                            descripcion: actual.alt,
                          }
                        : null
                    }
                    className="w-full h-40 rounded-xl border border-vc-cream"
                  />
                  <p className={`${hintClass} mt-1`}>
                    {actual.desdeBiblioteca
                      ? `Puesto a mano: ${asignado?.filename ?? "archivo de la biblioteca"}`
                      : actual.url
                        ? "Archivo por defecto del sitio"
                        : "Vacío — hoy se muestra un recuadro de «próximamente»"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-vc-blue-dark">
                    {slot.label}
                  </h3>
                  <p className="text-base text-vc-ink/70">{slot.ubicacion}</p>
                  <p className={hintClass}>{slot.recomendacion}</p>

                  {/* Camino corto: elegir un archivo del disco y que quede
                      puesto acá de una. No necesita que la biblioteca tenga
                      nada, que es justo el caso en el que la lista de abajo no
                      sirve para nada. */}
                  <div className="mt-3">
                    <MediaUploader soloTipo={slot.kind} slot={slot.key} />
                  </div>

                  <form action={asignarRanura} className="mt-4 space-y-3">
                    <input type="hidden" name="slot" value={slot.key} />

                    <label className="block">
                      <span className={labelClass}>
                        …o usar {slot.kind === "video" ? "un video" : "una foto"}{" "}
                        que ya está en la biblioteca
                      </span>
                      <select
                        name="media_id"
                        defaultValue={actual.mediaId ?? ""}
                        className={`${inputClass} mt-1`}
                      >
                        <option value="">Usar el archivo por defecto</option>
                        {opciones.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.filename}
                            {a.descripcion ? ` — ${a.descripcion}` : ""}
                          </option>
                        ))}
                      </select>
                      {opciones.length === 0 && (
                        <span className={`${hintClass} block`}>
                          Todavía no hay{" "}
                          {slot.kind === "video" ? "videos" : "fotos"} en la
                          biblioteca: usa el botón de arriba.
                        </span>
                      )}
                    </label>

                    {slot.kind === "imagen" && (
                      <label className="block">
                        <span className={labelClass}>
                          Descripción de la imagen
                        </span>
                        <span className={`${hintClass} block`}>
                          Lo que se lee en voz alta a quien navega con lector de
                          pantalla. Si lo dejas vacío se usa el texto de fábrica.
                        </span>
                        <TextInput
                          name="alt"
                          defaultValue={
                            actual.desdeBiblioteca ? actual.alt : ""
                          }
                          placeholder={slot.fallbackAlt ?? ""}
                          className="mt-1"
                        />
                      </label>
                    )}

                    <button type="submit" className={btnBlue}>
                      Guardar «{slot.label}»
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Subir a la biblioteca                                            */}
      {/* ------------------------------------------------------------------ */}
      <Card
        icon={Upload}
        title="Subir fotos o videos a la biblioteca"
        hint="Para material que todavía no va en ningún lugar fijo — por ejemplo, los videos de los testimonios. Para cambiar la portada o el video de las fundadoras es más rápido el botón de subir que tiene cada lugar aquí arriba."
        className="mt-6"
      >
        <MediaUploader />
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 3. La biblioteca                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Card
        icon={ImageIcon}
        title={`Biblioteca (${assets.length})`}
        hint={`${imagenes.length} ${imagenes.length === 1 ? "foto" : "fotos"} y ${videos.length} ${videos.length === 1 ? "video" : "videos"}.`}
        className="mt-6"
      >
        {assets.length === 0 ? (
          <div className="py-10 text-center">
            <Inbox className="w-10 h-10 mx-auto text-vc-ink/25" aria-hidden="true" />
            <p className="mt-3 text-lg text-vc-ink/70">
              Todavía no subiste ningún archivo.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {assets.map((a) => (
              <TarjetaArchivo key={a.id} asset={a} usos={usage[a.id] ?? []} />
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
