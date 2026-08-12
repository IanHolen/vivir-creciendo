import Link from "next/link";
import {
  Video,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Inbox,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getTestimoniosVideoAdmin, type TestimonioVideo } from "@/lib/testimonios";
import { getMediaAssets } from "@/lib/media-queries";
import type { MediaAsset } from "@/lib/media";
import {
  guardarTestimonio,
  alternarVisible,
  moverItem,
  borrarItem,
} from "@/lib/testimonios-actions";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  btnPrimary,
  btnBlue,
  btnGhost,
  btnDanger,
  inputClass,
  labelClass,
  hintClass,
} from "@/components/admin/ui";

export const metadata = { title: "Testimonios en video — Vivir Creciendo" };

/**
 * /admin/testimonios — punto 10 de la lista de Ian (12-ago-2026).
 *
 * Los videos de la página pública /testimonios. El video en sí NO se sube
 * desde acá: se sube en Multimedia (una sola pantalla de subida para todo el
 * sitio) y acá se elige de la lista. Así el mismo archivo puede reutilizarse y
 * la biblioteca sabe siempre dónde está usado cada cosa.
 */

function Check({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 w-6 h-6 shrink-0 rounded border-2 border-vc-cream text-vc-orange focus-visible:ring-4 focus-visible:ring-vc-orange/30"
      />
      <span>
        <span className="block text-base font-semibold text-vc-blue-dark">
          {label}
        </span>
        {hint && <span className={hintClass}>{hint}</span>}
      </span>
    </label>
  );
}

function CamposTestimonio({
  t,
  videos,
  imagenes,
}: {
  t?: TestimonioVideo;
  videos: MediaAsset[];
  imagenes: MediaAsset[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombre">
          <TextInput
            name="nombre"
            required
            defaultValue={t?.nombre ?? ""}
            placeholder="Virginia Estela Cohan"
          />
        </Field>
        <Field label="Procedencia" hint="Se lee debajo del nombre.">
          <TextInput
            name="contexto"
            defaultValue={t?.contexto ?? ""}
            placeholder="82 años · México · miembro desde 2025"
          />
        </Field>
      </div>

      <Field
        label="Frase destacada"
        hint="Una línea que se lee ANTES de darle play. Sin ella la página es una grilla de rectángulos negros y nadie sabe cuál mirar."
      >
        <TextInput
          name="titular"
          defaultValue={t?.titular ?? ""}
          placeholder="«Espero con gusto los miércoles»"
        />
      </Field>

      <Field
        label="Descripción"
        hint="Opcional. Un párrafo corto debajo del video."
      >
        <TextArea
          name="descripcion"
          rows={3}
          defaultValue={t?.descripcion ?? ""}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelClass}>Video</span>
          <span className={`${hintClass} block`}>
            De la biblioteca de Multimedia. Sin video, el testimonio no se
            publica aunque esté marcado como visible.
          </span>
          <select
            name="video_media_id"
            defaultValue={t?.video_media_id ?? ""}
            className={`${inputClass} mt-1.5`}
          >
            <option value="">— Sin video todavía —</option>
            {videos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.filename}
                {v.descripcion ? ` — ${v.descripcion}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Imagen de portada</span>
          <span className={`${hintClass} block`}>
            Opcional. Lo que se ve antes de darle play; sin ella el navegador
            muestra el primer fotograma, que suele ser el peor.
          </span>
          <select
            name="poster_media_id"
            defaultValue={t?.poster_media_id ?? ""}
            className={`${inputClass} mt-1.5`}
          >
            <option value="">— Sin portada —</option>
            {imagenes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.filename}
                {v.descripcion ? ` — ${v.descripcion}` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Check
        name="is_active"
        label="Visible en la página de testimonios"
        hint="Desmarcar lo esconde sin borrarlo."
        defaultChecked={t ? t.is_active : true}
      />
    </div>
  );
}

function Fila({
  t,
  i,
  total,
  videos,
  imagenes,
}: {
  t: TestimonioVideo;
  i: number;
  total: number;
  videos: MediaAsset[];
  imagenes: MediaAsset[];
}) {
  const sinVideo = !t.video_media_id;

  return (
    <li
      className={`rounded-2xl border p-5 ${
        t.is_active && !sinVideo
          ? "bg-white border-vc-cream"
          : "bg-vc-cream/50 border-vc-cream"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-full bg-vc-blue-soft px-3 py-1 text-sm font-semibold text-vc-blue">
            {i + 1}º
          </span>
          {!t.is_active && (
            <span className="rounded-full bg-vc-ink/10 px-3 py-1 text-sm font-semibold text-vc-ink/70">
              Oculto
            </span>
          )}
          {sinVideo && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              Sin video: no se publica
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(["up", "down"] as const).map((dir) => (
            <form action={moverItem} key={dir}>
              <input type="hidden" name="tabla" value="testimonios_video" />
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="dir" value={dir} />
              <button
                type="submit"
                disabled={dir === "up" ? i === 0 : i === total - 1}
                aria-label={`${dir === "up" ? "Subir" : "Bajar"} el testimonio de ${t.nombre}`}
                className="w-11 h-11 rounded-lg border-2 border-vc-cream bg-white flex items-center justify-center hover:border-vc-blue disabled:opacity-30 disabled:hover:border-vc-cream"
              >
                {dir === "up" ? (
                  <ArrowUp className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <ArrowDown className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </form>
          ))}
          <form action={alternarVisible}>
            <input type="hidden" name="tabla" value="testimonios_video" />
            <input type="hidden" name="id" value={t.id} />
            <input type="hidden" name="next" value={String(!t.is_active)} />
            <button type="submit" className={`${btnGhost} min-h-[44px] px-4 text-base`}>
              {t.is_active ? (
                <>
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                  Ocultar
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" aria-hidden="true" />
                  Mostrar
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-5">
        {t.video_url ? (
          <video
            src={t.video_url}
            poster={t.poster_url ?? undefined}
            controls
            preload="metadata"
            className="w-full rounded-xl bg-black aspect-video object-contain"
          />
        ) : (
          <div className="w-full aspect-video rounded-xl bg-vc-cream flex items-center justify-center text-vc-ink/40">
            <Video className="w-8 h-8" aria-hidden="true" />
          </div>
        )}

        <div>
          <p className="text-lg font-bold text-vc-blue-dark">{t.nombre}</p>
          {t.contexto && (
            <p className="text-base text-vc-ink/60">{t.contexto}</p>
          )}
          {t.titular && (
            <p className="mt-2 text-lg italic text-vc-ink">{t.titular}</p>
          )}
          {t.descripcion && (
            <p className="mt-2 text-base text-vc-ink/70">{t.descripcion}</p>
          )}
        </div>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-base font-semibold text-vc-blue hover:text-vc-orange">
          Editar
        </summary>
        <form action={guardarTestimonio} className="mt-4">
          <input type="hidden" name="id" value={t.id} />
          <CamposTestimonio t={t} videos={videos} imagenes={imagenes} />
          <button type="submit" className={`${btnBlue} mt-4`}>
            Guardar cambios
          </button>
        </form>

        <details className="mt-5">
          <summary className="cursor-pointer text-base text-vc-ink/55 hover:text-red-700">
            Eliminar este testimonio
          </summary>
          <form
            action={borrarItem}
            className="mt-2 rounded-xl bg-red-50 border border-red-200 p-3"
          >
            <input type="hidden" name="tabla" value="testimonios_video" />
            <input type="hidden" name="id" value={t.id} />
            <p className="text-sm text-red-800">
              Se borra el testimonio, no el video: el archivo queda en la
              biblioteca de Multimedia.
            </p>
            <button
              type="submit"
              className={`${btnDanger} mt-2 min-h-[44px] text-base`}
            >
              Sí, eliminar el testimonio de {t.nombre}
            </button>
          </form>
        </details>
      </details>
    </li>
  );
}

export default async function TestimoniosAdminPage() {
  await requireAdmin();
  const [testimonios, assets] = await Promise.all([
    getTestimoniosVideoAdmin(),
    getMediaAssets(),
  ]);

  const videos = assets.filter((a) => a.kind === "video");
  const imagenes = assets.filter((a) => a.kind === "imagen");
  const publicados = testimonios.filter(
    (t) => t.is_active && t.video_media_id
  ).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
            Testimonios en video
          </h2>
          <p className="mt-1 text-base text-vc-ink/60">
            Los videos de la página <code className="text-vc-blue">/testimonios</code>.
            {" "}
            {publicados} de {testimonios.length} publicados. El video se sube en
            Multimedia y acá se elige de la lista.
          </p>
        </div>
        <Link
          href="/testimonios"
          target="_blank"
          className={`${btnGhost} min-h-[44px] text-base`}
        >
          Ver la página
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      {videos.length === 0 && (
        <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
          <p className="flex items-start gap-2 text-lg text-amber-900">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
            Todavía no hay ningún video en la biblioteca. Primero{" "}
            <Link href="/admin/multimedia" className="underline font-semibold">
              súbelo en Multimedia
            </Link>{" "}
            y después vuelve acá para armar el testimonio.
          </p>
        </div>
      )}

      <Card icon={Plus} title="Agregar un testimonio" className="mt-6">
        <form action={guardarTestimonio}>
          <CamposTestimonio videos={videos} imagenes={imagenes} />
          <button type="submit" className={`${btnPrimary} mt-4`}>
            <Plus className="w-5 h-5" aria-hidden="true" />
            Agregar testimonio
          </button>
        </form>
      </Card>

      <Card
        icon={Video}
        title={`Testimonios (${testimonios.length})`}
        className="mt-6"
      >
        {testimonios.length === 0 ? (
          <div className="py-10 text-center">
            <Inbox className="w-10 h-10 mx-auto text-vc-ink/25" aria-hidden="true" />
            <p className="mt-3 text-lg text-vc-ink/70">
              Todavía no hay testimonios. La página /testimonios muestra un
              mensaje de «próximamente» mientras esta lista esté vacía.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {testimonios.map((t, i) => (
              <Fila
                key={t.id}
                t={t}
                i={i}
                total={testimonios.length}
                videos={videos}
                imagenes={imagenes}
              />
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
