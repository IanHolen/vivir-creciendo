"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { crearSubidaFirmada, registrarArchivo } from "@/lib/media-actions";
import {
  MEDIA_ACCEPT,
  MEDIA_BUCKET,
  MEDIA_MAX_BYTES,
  type MediaKind,
} from "@/lib/media";
import { btnBlue, inputClass, labelClass, hintClass } from "./ui";

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
 */

type Estado =
  | { fase: "idle" }
  | { fase: "subiendo"; nombre: string }
  | { fase: "ok"; nombre: string }
  | { fase: "error"; mensaje: string };

/** Deduce si es foto o video por el tipo MIME que informa el navegador. */
function kindDe(file: File): MediaKind | null {
  if (file.type.startsWith("image/")) return "imagen";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

export default function MediaUploader({
  soloTipo,
}: {
  /** Limita el selector a fotos o a videos. Sin esto, acepta las dos cosas. */
  soloTipo?: MediaKind;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<Estado>({ fase: "idle" });
  const [, startTransition] = useTransition();

  const accept = soloTipo
    ? MEDIA_ACCEPT[soloTipo]
    : `${MEDIA_ACCEPT.imagen},${MEDIA_ACCEPT.video}`;

  async function subir(file: File) {
    const kind = soloTipo ?? kindDe(file);
    if (!kind) {
      setEstado({
        fase: "error",
        mensaje: "Solo se pueden subir fotos (JPG, PNG, WEBP) o videos (MP4, WEBM, MOV).",
      });
      return;
    }
    if (file.size > MEDIA_MAX_BYTES) {
      setEstado({
        fase: "error",
        mensaje: `"${file.name}" pesa demasiado. El máximo son 200 MB.`,
      });
      return;
    }

    setEstado({ fase: "subiendo", nombre: file.name });

    const permiso = await crearSubidaFirmada(file.name, kind);
    if (!permiso.ok) {
      setEstado({ fase: "error", mensaje: permiso.error });
      return;
    }

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
      return;
    }

    const guardado = await registrarArchivo({
      path: permiso.path,
      filename: file.name,
      kind,
      descripcion,
    });

    if (!guardado.ok) {
      setEstado({ fase: "error", mensaje: guardado.error });
      return;
    }

    setEstado({ fase: "ok", nombre: file.name });
    setDescripcion("");
    if (inputRef.current) inputRef.current.value = "";
    startTransition(() => router.refresh());
  }

  const subiendo = estado.fase === "subiendo";

  return (
    <div className="space-y-4">
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

      <div>
        <input
          ref={inputRef}
          id="media-file"
          type="file"
          accept={accept}
          disabled={subiendo}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void subir(file);
          }}
        />
        <label
          htmlFor="media-file"
          className={`${btnBlue} ${subiendo ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}
        >
          {subiendo ? (
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="w-5 h-5" aria-hidden="true" />
          )}
          {subiendo ? "Subiendo…" : "Elegir archivo y subir"}
        </label>
        <p className={hintClass}>
          Fotos JPG, PNG o WEBP. Videos MP4, WEBM o MOV. Hasta 200 MB por
          archivo. Un video largo puede tardar varios minutos: no cierres esta
          pestaña.
        </p>
      </div>

      {/* aria-live para que el lector de pantalla anuncie el resultado: la
          subida es asíncrona y no mueve el foco a ningún lado. */}
      <div aria-live="polite">
        {estado.fase === "subiendo" && (
          <p className="flex items-center gap-2 text-lg text-vc-blue">
            <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
            Subiendo «{estado.nombre}»…
          </p>
        )}
        {estado.fase === "ok" && (
          <p className="flex items-center gap-2 text-lg text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            «{estado.nombre}» se subió a la biblioteca.
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
