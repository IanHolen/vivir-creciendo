"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  crearSubidaFirmada,
  registrarArchivo,
  usarEnRanura,
} from "@/lib/media-actions";
import {
  MEDIA_ACCEPT,
  MEDIA_BUCKET,
  MEDIA_MAX_BYTES,
  type MediaKind,
} from "@/lib/media";
import { btnBlue, btnGhost, inputClass, labelClass, hintClass } from "./ui";

/**
 * Subida de archivos a la biblioteca.
 *
 * El archivo va DIRECTO del navegador al Storage de Supabase con una URL
 * firmada que emite el servidor. No pasa por una server action a propósito:
 * las server actions tienen un tope de 1 MB por defecto (100 MB como máximo
 * absoluto) y un video de testimonio no entra ahí.
 *
 * El servidor conserva el control igual — sin la URL firmada, que solo se
 * emite a administradores, la RLS del bucket rechaza la escritura.
 *
 * Dos formas de usarlo (Ian, 20-ago-2026):
 *
 *   · suelto, en la tarjeta de "Subir archivos": acepta varios de una vez y
 *     los deja en la biblioteca;
 *   · con `slot`, incrustado dentro de una ranura: sube UN archivo y lo deja
 *     puesto ahí mismo. Antes había que subir abajo, volver arriba, buscar el
 *     nombre en una lista y guardar — cuatro pasos para cambiar una foto, y
 *     con la biblioteca vacía la lista no ofrecía nada que elegir.
 */

type Estado =
  | { fase: "idle" }
  | { fase: "subiendo"; nombre: string; pct: number | null; i: number; total: number }
  | { fase: "ok"; mensaje: string }
  | { fase: "error"; mensaje: string };

/** Deduce si es foto o video por el tipo MIME que informa el navegador. */
function kindDe(file: File): MediaKind | null {
  if (file.type.startsWith("image/")) return "imagen";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

/**
 * PUT del archivo a la URL firmada con XHR, que es lo único que informa
 * progreso de subida — `fetch` no lo hace. El cuerpo es el mismo que arma
 * supabase-js: un FormData con `cacheControl` y el archivo en el campo vacío.
 *
 * Devuelve false si algo se sale de lo previsto, y entonces quien llama repite
 * la subida con supabase-js. Un video de 60 MB sin barra de progreso es
 * incómodo; un video de 60 MB que no sube es un problema de verdad, así que la
 * barra nunca es la única vía.
 */
function subirConProgreso(
  signedUrl: string,
  file: File,
  onPct: (pct: number) => void
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onPct(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300);
      xhr.onerror = () => resolve(false);
      xhr.onabort = () => resolve(false);

      const body = new FormData();
      body.append("cacheControl", "3600");
      body.append("", file);
      xhr.send(body);
    } catch {
      resolve(false);
    }
  });
}

export default function MediaUploader({
  soloTipo,
  slot,
  etiquetaBoton,
}: {
  /** Limita el selector a fotos o a videos. Sin esto, acepta las dos cosas. */
  soloTipo?: MediaKind;
  /**
   * Ranura a la que asignar el archivo apenas termine de subir. Con esto, el
   * subidor pasa a modo compacto: un archivo por vez y sin descripción.
   */
  slot?: string;
  /** Texto del botón. Por defecto, el de la biblioteca. */
  etiquetaBoton?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<Estado>({ fase: "idle" });
  const [, startTransition] = useTransition();

  const enRanura = slot != null;
  // `id` único: puede haber varios subidores en la misma página (uno por
  // ranura) y `htmlFor` tiene que apuntar a un solo input.
  const inputId = `media-file-${slot ?? "biblioteca"}`;

  const accept = soloTipo
    ? MEDIA_ACCEPT[soloTipo]
    : `${MEDIA_ACCEPT.imagen},${MEDIA_ACCEPT.video}`;

  /** Sube un archivo. Devuelve el id de la biblioteca, o null si algo falló. */
  async function subirUno(
    file: File,
    i: number,
    total: number
  ): Promise<string | null> {
    const kind = soloTipo ?? kindDe(file);
    if (!kind) {
      setEstado({
        fase: "error",
        mensaje: `"${file.name}" no es una foto ni un video. Se aceptan JPG, PNG, WEBP, MP4, WEBM y MOV.`,
      });
      return null;
    }
    const real = kindDe(file);
    if (soloTipo && real && real !== soloTipo) {
      setEstado({
        fase: "error",
        mensaje: `Acá va ${soloTipo === "video" ? "un video" : "una foto"}, y "${file.name}" es ${real === "video" ? "un video" : "una foto"}.`,
      });
      return null;
    }
    if (file.size > MEDIA_MAX_BYTES) {
      setEstado({
        fase: "error",
        mensaje: `"${file.name}" pesa demasiado. El máximo son 200 MB.`,
      });
      return null;
    }

    setEstado({ fase: "subiendo", nombre: file.name, pct: null, i, total });

    const permiso = await crearSubidaFirmada(file.name, kind);
    if (!permiso.ok) {
      setEstado({ fase: "error", mensaje: permiso.error });
      return null;
    }

    const conProgreso = await subirConProgreso(permiso.signedUrl, file, (pct) =>
      setEstado({ fase: "subiendo", nombre: file.name, pct, i, total })
    );

    if (!conProgreso) {
      // Segundo intento por la vía de la librería, sin progreso.
      setEstado({ fase: "subiendo", nombre: file.name, pct: null, i, total });
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .uploadToSignedUrl(permiso.path, permiso.token, file, {
          contentType: file.type,
        });
      if (error) {
        setEstado({
          fase: "error",
          mensaje: `No se pudo subir "${file.name}". ${error.message}`,
        });
        return null;
      }
    }

    const guardado = await registrarArchivo({
      path: permiso.path,
      filename: file.name,
      kind,
      descripcion,
    });

    if (!guardado.ok) {
      setEstado({ fase: "error", mensaje: guardado.error });
      return null;
    }
    return guardado.id;
  }

  async function subir(files: File[]) {
    let subidos = 0;
    for (const [i, file] of files.entries()) {
      const id = await subirUno(file, i + 1, files.length);
      if (!id) break; // el mensaje de error ya quedó puesto
      subidos++;

      if (slot) {
        const puesto = await usarEnRanura(slot, id);
        if (!puesto.ok) {
          setEstado({
            fase: "error",
            mensaje: `"${file.name}" se subió a la biblioteca, pero no se pudo poner acá: ${puesto.error}`,
          });
          break;
        }
      }
    }

    if (subidos > 0) {
      setEstado((prev) =>
        prev.fase === "error"
          ? prev
          : {
              fase: "ok",
              mensaje: slot
                ? "Listo, ya está puesto acá."
                : subidos === 1
                  ? "El archivo se subió a la biblioteca."
                  : `Se subieron ${subidos} archivos a la biblioteca.`,
            }
      );
      setDescripcion("");
      startTransition(() => router.refresh());
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  const subiendo = estado.fase === "subiendo";

  return (
    <div className={enRanura ? "space-y-2" : "space-y-4"}>
      {/* La descripción solo en la tarjeta suelta: dentro de una ranura el
          formulario de al lado ya pide el texto alternativo, y dos campos que
          parecen lo mismo confunden más de lo que ayudan. */}
      {!enRanura && (
        <label className="block">
          <span className={labelClass}>Descripción (opcional)</span>
          <span className={`${hintClass} block`}>
            Para qué es este archivo. En las fotos, además, es el texto que leen
            las personas que navegan con lector de pantalla.
          </span>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej.: Sesión de Cine Reflexión de julio"
            disabled={subiendo}
            className={`${inputClass} mt-1.5`}
          />
        </label>
      )}

      <div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={!enRanura}
          disabled={subiendo}
          className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) void subir(files);
          }}
        />
        <label
          htmlFor={inputId}
          className={`${enRanura ? btnGhost : btnBlue} ${
            subiendo ? "opacity-60 pointer-events-none" : "cursor-pointer"
          }`}
        >
          {subiendo ? (
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="w-5 h-5" aria-hidden="true" />
          )}
          {subiendo
            ? "Subiendo…"
            : (etiquetaBoton ??
              (enRanura
                ? `Subir ${soloTipo === "video" ? "un video" : "una foto"} y ponerlo acá`
                : "Elegir archivos y subir"))}
        </label>
        {!enRanura && (
          <p className={hintClass}>
            Fotos JPG, PNG o WEBP. Videos MP4, WEBM o MOV. Hasta 200 MB por
            archivo. Puedes elegir varios de una vez. Un video largo tarda unos
            minutos: no cierres esta pestaña.
          </p>
        )}
      </div>

      {/* aria-live para que el lector de pantalla anuncie el resultado: la
          subida es asíncrona y no mueve el foco a ningún lado. */}
      <div aria-live="polite">
        {estado.fase === "subiendo" && (
          <div>
            <p className="flex items-center gap-2 text-lg text-vc-blue">
              <Loader2
                className="w-5 h-5 animate-spin shrink-0"
                aria-hidden="true"
              />
              {estado.total > 1 && `(${estado.i} de ${estado.total}) `}
              Subiendo «{estado.nombre}»
              {estado.pct != null ? ` — ${estado.pct}%` : "…"}
            </p>
            {/* Barra sin `<progress>`: el elemento nativo no se puede pintar
                con los colores del panel en todos los navegadores. El valor va
                igual en `aria-valuenow` para quien no la ve. */}
            <div
              className="mt-2 h-3 w-full rounded-full bg-vc-cream overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={estado.pct ?? undefined}
              aria-label={`Subiendo ${estado.nombre}`}
            >
              <div
                className={`h-full bg-vc-blue transition-[width] duration-200 ${
                  estado.pct == null ? "animate-pulse" : ""
                }`}
                style={{ width: `${estado.pct ?? 100}%` }}
              />
            </div>
          </div>
        )}
        {estado.fase === "ok" && (
          <p className="flex items-center gap-2 text-lg text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            {estado.mensaje}
          </p>
        )}
        {estado.fase === "error" && (
          <p className="flex items-start gap-2 text-lg text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-1" aria-hidden="true" />
            {estado.mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
