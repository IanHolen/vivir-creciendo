/**
 * Multimedia del sitio (punto 3 de la lista de Ian, 12-ago-2026).
 *
 * Dos conceptos que conviene no mezclar:
 *
 *   BIBLIOTECA (`media_assets`) — qué archivos existen. Se suben una vez y
 *   quedan disponibles para lo que sea.
 *
 *   RANURAS (`site_media`)      — dónde se usa cada uno. Una ranura es un
 *   hueco fijo de la interfaz: la foto de la portada, el video de las
 *   fundadoras, la foto de cada cofundadora.
 *
 * El CATÁLOGO de ranuras vive acá, en el código, y no en la base: una ranura
 * sin componente que la pinte no sirve de nada, y la descripción de "dónde se
 * ve esto" tiene que envejecer junto al componente que la usa. La base solo
 * guarda qué archivo ocupa cada ranura.
 */

export type MediaKind = "imagen" | "video";

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  storage_path: string;
  url: string;
  filename: string;
  descripcion: string | null;
  bytes: number | null;
  mime: string | null;
  created_at: string;
}

/** Bucket público de la biblioteca. */
export const MEDIA_BUCKET = "media";

/** Tope del bucket (200 MB). Se valida también en el cliente antes de subir. */
export const MEDIA_MAX_BYTES = 200 * 1024 * 1024;

export const MEDIA_ACCEPT: Record<MediaKind, string> = {
  imagen: "image/jpeg,image/png,image/webp,image/gif,image/avif",
  video: "video/mp4,video/webm,video/quicktime",
};

/**
 * Las ranuras fijas del sitio.
 *
 * Los logos y el favicon NO están acá a propósito (decisión de Ian): son
 * identidad de marca, se cambian muy de vez en cuando y un archivo mal subido
 * deja el sitio sin logo en todas las páginas a la vez. Siguen viviendo en
 * `public/images` y se cambian por código.
 */
export interface MediaSlot {
  key: string;
  kind: MediaKind;
  /** Nombre corto, el que se ve como título en el panel. */
  label: string;
  /** Dónde se ve exactamente. Es lo que el panel muestra debajo del título. */
  ubicacion: string;
  /** Qué archivo conviene subir ahí. */
  recomendacion: string;
  /** Archivo que se usa mientras la ranura esté vacía. */
  fallback: string | null;
  /** Texto alternativo por defecto (solo imágenes). */
  fallbackAlt?: string;
  /**
   * Carátula del video por defecto (solo videos). Solo se usa mientras la
   * ranura muestre el archivo por defecto: si alguien sube otro video, esta
   * imagen sería un fotograma de una grabación distinta.
   */
  fallbackPoster?: string;
  /** Encuadre del recorte, para las fotos que se muestran en círculo. */
  objectPosition?: string;
}

export const MEDIA_SLOTS: MediaSlot[] = [
  {
    key: "hero.foto",
    kind: "imagen",
    label: "Foto de la portada",
    ubicacion: "Inicio → arriba a la derecha, al lado del título principal.",
    recomendacion:
      "Horizontal, 4:3 (por ejemplo 1200 × 900 px). Es lo primero que se ve: conviene una captura real de una sesión de Zoom de la comunidad.",
    fallback: "/images/hero-community.jpg",
    fallbackAlt:
      "Grupo de mujeres y hombres de 65 años conversando y riendo en una sesión online de Vivir Creciendo",
  },
  {
    key: "hero.video",
    kind: "video",
    label: "Video de las fundadoras",
    ubicacion: "Inicio → recuadro ancho debajo de la portada.",
    recomendacion:
      "Horizontal 16:9, alrededor de 90 segundos. Nurit y Alejandra contando de qué se trata. Con subtítulos en español: buena parte del público lo va a ver sin sonido.",
    // El video de presentación de las fundadoras (Ian, 20-ago-2026). Viene en
    // el repo y no de la biblioteca a propósito: es parte de la portada, tiene
    // que estar aunque la base no responda.
    //
    // El original venía en HEVC de 72 MB. Se recodificó a H.264 (HEVC no lo
    // reproduce Firefox), 1080p a 2,8 Mbps -> 25 MB, con el índice al
    // principio del archivo para que empiece sin bajarlo entero. Si se
    // reemplaza, mantener H.264: es el único códec que reproducen todos los
    // navegadores.
    fallback: "/videos/fundadoras.mp4",
    fallbackPoster: "/images/fundadoras-poster.jpg",
  },
  {
    key: "nosotras.alejandra",
    kind: "imagen",
    label: "Foto de Alejandra",
    ubicacion: "Inicio → sección NOSOTRAS, y página Nosotros.",
    recomendacion:
      "Retrato con la cara en la mitad de arriba. Se recorta en círculo de 128 px.",
    fallback: "/images/alejandra.jpg",
    fallbackAlt: "Foto de Alejandra Furman-Paz",
    objectPosition: "object-top",
  },
  {
    key: "nosotras.nurit",
    kind: "imagen",
    label: "Foto de Nurit",
    ubicacion: "Inicio → sección NOSOTRAS, y página Nosotros.",
    recomendacion:
      "Retrato con la cara en la mitad de arriba. Se recorta en círculo de 128 px.",
    fallback: "/images/nurit.png",
    fallbackAlt: "Foto de Nurit Mileris-Zylbersztejn",
  },
];

export function findSlot(key: string): MediaSlot | undefined {
  return MEDIA_SLOTS.find((s) => s.key === key);
}

/** Lo que un componente necesita para pintar una ranura. */
export interface ResolvedSlot {
  slot: MediaSlot;
  /** URL a usar: la asignada, o el archivo por defecto, o null si no hay. */
  url: string | null;
  alt: string;
  /** true si sale de la biblioteca; false si es el archivo por defecto. */
  desdeBiblioteca: boolean;
  mediaId: string | null;
  objectPosition: string;
}

/** Tamaño legible ("3,2 MB"). */
export function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
