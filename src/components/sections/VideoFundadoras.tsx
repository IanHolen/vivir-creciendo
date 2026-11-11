import { getSiteMedia } from "@/lib/media-queries";
import { obtenerVideoYoutube } from "@/lib/video-fundadoras";

/**
 * El video de Nurit y Alejandra. Va debajo de las bios, dentro de NOSOTRAS
 * (documento de las fundadoras, nov-2026).
 *
 * Prioridad: link de YouTube cargado en /admin/multimedia → MP4 de la ranura
 * "hero.video" → recuadro de "próximamente". YouTube se incrusta con el
 * dominio youtube-nocookie.com (sin cookies de seguimiento hasta que la
 * persona le da play).
 */
export default async function VideoFundadoras() {
  const [media, yt] = await Promise.all([getSiteMedia(), obtenerVideoYoutube()]);
  const video = media["hero.video"];

  if (yt.id) {
    return (
      <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yt.id}?rel=0&modestbranding=1&hl=es`}
          title="Nurit y Alejandra te cuentan de qué se trata Vivir Creciendo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  if (video.url) {
    return (
      <video
        src={video.url}
        poster={video.desdeBiblioteca ? undefined : video.slot.fallbackPoster}
        controls
        preload="metadata"
        playsInline
        className="w-full aspect-video rounded-3xl bg-black shadow-xl"
      >
        Tu navegador no puede reproducir este video.
      </video>
    );
  }

  return (
    <div
      className="relative aspect-video w-full rounded-3xl overflow-hidden bg-white border border-vc-blue/15 flex flex-col items-center justify-center text-center px-6"
      role="img"
      aria-label="Video de las fundadoras, próximamente"
    >
      <span className="flex items-center justify-center w-16 h-16 rounded-full bg-vc-orange/10">
        <svg className="w-7 h-7 text-vc-orange translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <p className="mt-4 text-base md:text-lg font-medium text-vc-ink/70">
        Nurit y Alejandra te cuentan de qué se trata — video próximamente
      </p>
    </div>
  );
}
