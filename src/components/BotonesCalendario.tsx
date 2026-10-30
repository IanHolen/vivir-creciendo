import { CalendarPlus, Download } from "lucide-react";

export interface EnlacesCalendario {
  /** Google Calendar con el evento ya cargado. */
  google: string | null;
  /** Ruta del .ics (Apple / Outlook / celular). */
  ics: string;
}

/**
 * Los dos botones de "Agregar a mi calendario". Solo presentación: sirve en
 * server components (perfil, ficha) y en la ventana de "¡Listo!" después de
 * inscribirse, que es de cliente. Los enlaces se arman en el servidor
 * (lib/calendario.ts).
 */
export default function BotonesCalendario({
  enlaces,
  compacto = false,
  sobreOscuro = false,
}: {
  enlaces: EnlacesCalendario;
  /** Versión chica para listas (perfil). */
  compacto?: boolean;
  /** Sobre fondo azul: el botón secundario va en blanco. */
  sobreOscuro?: boolean;
}) {
  const btn = compacto
    ? "inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-base font-semibold rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50"
    : "inline-flex items-center justify-center gap-2 min-h-[56px] px-6 py-3 text-lg font-semibold rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/50";

  return (
    <div className={`flex flex-col sm:flex-row flex-wrap gap-3 ${sobreOscuro ? "justify-center" : ""}`}>
      {enlaces.google && (
        <a
          href={enlaces.google}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-vc-orange hover:bg-vc-orange-light text-white shadow`}
        >
          <CalendarPlus className="w-5 h-5" aria-hidden="true" />
          Agregar a Google Calendar
        </a>
      )}
      <a
        href={enlaces.ics}
        className={`${btn} ${
          sobreOscuro
            ? "border-2 border-white/70 text-white hover:bg-white/10"
            : "border-2 border-vc-orange-dark text-vc-orange-dark hover:bg-vc-orange/10"
        }`}
      >
        <Download className="w-5 h-5" aria-hidden="true" />
        Apple / Outlook (.ics)
      </a>
    </div>
  );
}
