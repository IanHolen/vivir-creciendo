"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  LogIn,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { inscribirse } from "@/lib/registration-actions";
import type { RegistroStatus } from "@/lib/registrations";
import BotonesCalendario, { type EnlacesCalendario } from "@/components/BotonesCalendario";

/**
 * Inscripción a una actividad, con la prueba única de actividad de paga
 * (puntos 13 y 13.1 de la lista de Ian, 12-ago-2026).
 *
 * LAS REGLAS, tal como las decide la base:
 *   · Actividad gratuita  → siempre se puede.
 *   · De paga con membresía → siempre se puede.
 *   · De paga sin membresía → UNA sola vez en la vida (la prueba).
 *   · De paga sin membresía y con la prueba ya usada → a comprar.
 *
 * Este componente NO decide nada de eso: llama a `inscribirse()`, que llama a
 * la función de la base, y solo traduce el resultado a la ventana que
 * corresponde. El estado que recibe por props es para elegir qué texto mostrar
 * ANTES de pulsar; si estuviera desactualizado, la base igual rechaza.
 *
 * 13.1: al anotarse a una gratuita, y solo si todavía le queda la prueba, se
 * ofrece elegir una actividad de la membresía para probar.
 */

export interface ActividadMini {
  id: string;
  title: string;
  short_preview: string;
}

interface Props {
  activityId: string;
  esGratuita: boolean;
  /** Link externo de inscripción (Zoom / formulario), si la actividad tiene. */
  enlace: string | null;
  autenticado: boolean;
  tieneMembresia: boolean;
  pruebaUsada: boolean;
  yaInscrito: boolean;
  /** Actividades de paga que se ofrecen como prueba en el popup de 13.1. */
  premiumParaProbar: ActividadMini[];
  /** "Agregar a mi calendario" una vez inscrito; null si no hay fecha cargada. */
  calendario: EnlacesCalendario | null;
}

type Ventana =
  | { tipo: "cerrada" }
  /** Se anotó. `siguiente` = mostrar además la oferta de probar una premium. */
  | {
      tipo: "exito";
      status: RegistroStatus;
      enlace: string | null;
      calendario: EnlacesCalendario | null;
      ofrecerPrueba: boolean;
    }
  /** Ya gastó la prueba: hay que vender la membresía. */
  | { tipo: "vender" }
  | { tipo: "error"; mensaje: string };

const BTN_PRINCIPAL =
  "inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-white/50 shadow-lg disabled:opacity-60";

const BTN_SECUNDARIO =
  "inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 rounded-xl border-2 border-vc-orange-dark text-vc-orange-dark font-semibold text-lg hover:bg-vc-orange-dark hover:text-white transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/40";

/**
 * Ventana emergente sobre <dialog> nativo.
 *
 * Se usa el elemento del navegador y no un div flotante porque `showModal()`
 * trae gratis lo que más se suele hacer mal a mano: atrapa el foco dentro,
 * cierra con Escape, deja inerte el resto de la página y la anuncia como
 * diálogo modal a los lectores de pantalla.
 */
function Modal({
  abierta,
  onClose,
  titulo,
  children,
}: {
  abierta: boolean;
  onClose: () => void;
  titulo: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierta && !d.open) d.showModal();
    if (!abierta && d.open) d.close();
  }, [abierta]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      aria-labelledby="modal-titulo"
      // m-auto: el reset de Tailwind le quita al <dialog> el margin:auto del
      // navegador y la ventana quedaba pegada arriba a la izquierda.
      className="m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-3xl p-0 bg-white text-vc-ink shadow-2xl backdrop:bg-vc-blue-dark/60 open:animate-in"
    >
      <div className="p-8 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="modal-titulo"
            className="font-(family-name:--font-display) text-2xl font-black text-vc-blue-dark uppercase tracking-tight"
          >
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-11 h-11 shrink-0 -mt-2 -mr-2 rounded-lg flex items-center justify-center text-vc-ink/50 hover:text-vc-ink hover:bg-vc-cream focus-visible:ring-4 focus-visible:ring-vc-orange/40"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}

export default function ActivityRegisterButton({
  activityId,
  esGratuita,
  enlace,
  autenticado,
  tieneMembresia,
  pruebaUsada,
  yaInscrito,
  premiumParaProbar,
  calendario,
}: Props) {
  const router = useRouter();
  const [ventana, setVentana] = useState<Ventana>({ tipo: "cerrada" });
  const [enviando, setEnviando] = useState<string | null>(null);

  const cerrar = () => {
    setVentana({ tipo: "cerrada" });
    router.refresh();
  };

  async function anotarse(id: string, esOfertaDePrueba = false) {
    setEnviando(id);
    const r = await inscribirse(id);
    setEnviando(null);

    if (!r.ok) {
      setVentana(
        r.error === "trial_used"
          ? { tipo: "vender" }
          : { tipo: "error", mensaje: r.mensaje }
      );
      return;
    }

    setVentana({
      tipo: "exito",
      status: r.status,
      enlace: r.enlace,
      calendario: r.calendario,
      // 13.1: la oferta va solo después de una gratuita, y solo si la prueba
      // sigue disponible. Después de gastarla en la propia oferta, no.
      ofrecerPrueba:
        !esOfertaDePrueba &&
        r.status === "gratuita" &&
        !tieneMembresia &&
        !pruebaUsada &&
        premiumParaProbar.length > 0,
    });
  }

  // --- Estados previos al clic -------------------------------------------

  if (!autenticado) {
    return (
      <div className="text-center">
        {/* `next` hace que después de entrar vuelva a esta misma ficha y no a
            la portada, que era lo que pasaba antes. */}
        <Link
          href={`/login?next=${encodeURIComponent(`/actividades/${activityId}`)}`}
          className={BTN_PRINCIPAL}
        >
          <LogIn className="w-5 h-5" aria-hidden="true" />
          Inicia sesión para inscribirte
        </Link>
        <p className="mt-3 text-base text-white/70">
          Crear la cuenta es gratis y solo pide nombre y correo.
        </p>
      </div>
    );
  }

  if (yaInscrito) {
    return (
      <div className="text-center">
        <p className="inline-flex items-center gap-2 text-xl font-semibold text-white">
          <Check className="w-6 h-6 text-vc-orange" aria-hidden="true" />
          Ya estás inscrito
        </p>
        {enlace && (
          <p className="mt-4">
            <a
              href={enlace}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_PRINCIPAL}
            >
              Abrir el enlace del encuentro
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </a>
          </p>
        )}
        {calendario && (
          <div className="mt-8 pt-6 border-t border-white/15">
            <p className="mb-4 text-lg text-white/85">
              📅 Agrégala a tu calendario y te avisamos una hora antes.
            </p>
            <BotonesCalendario enlaces={calendario} sobreOscuro />
          </div>
        )}
      </div>
    );
  }

  // Aviso previo honesto: si es de paga, sin membresía y con prueba
  // disponible, conviene decirle que la va a gastar ANTES de que pulse.
  const gastaraPrueba = !esGratuita && !tieneMembresia && !pruebaUsada;
  const bloqueada = !esGratuita && !tieneMembresia && pruebaUsada;

  return (
    <div className="text-center">
      <button
        type="button"
        disabled={enviando != null}
        onClick={() => anotarse(activityId)}
        className={BTN_PRINCIPAL}
      >
        {enviando === activityId ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Inscribiendo…
          </>
        ) : (
          <>
            Quiero inscribirme
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </>
        )}
      </button>

      {gastaraPrueba && (
        <p className="mt-3 text-base text-white/80">
          Esta actividad es de la membresía. Puedes probarla una vez, gratis.
        </p>
      )}
      {bloqueada && (
        <p className="mt-3 text-base text-white/80">
          Ya usaste tu actividad de prueba. Esta es parte de la membresía.
        </p>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Se anotó                                                            */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        abierta={ventana.tipo === "exito"}
        onClose={cerrar}
        titulo={
          ventana.tipo === "exito" && ventana.status === "already"
            ? "Ya estabas inscrito"
            : "¡Listo, ya estás dentro!"
        }
      >
        {ventana.tipo === "exito" && (
          <div className="text-left">
            <p className="text-lg text-vc-ink/85 leading-relaxed">
              {ventana.status === "prueba"
                ? "Te anotamos con tu actividad de prueba. Es la única de la membresía a la que puedes entrar sin suscribirte, así que aprovéchala."
                : ventana.status === "already"
                  ? "Tu lugar ya estaba reservado. No te anotamos dos veces."
                  : "Te guardamos el lugar. Te esperamos."}
            </p>

            {ventana.enlace && (
              <a
                href={ventana.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN_SECUNDARIO} mt-5 w-full`}
              >
                Abrir el enlace del encuentro
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
            )}

            {ventana.calendario && (
              <div className="mt-6 rounded-xl bg-vc-cream/60 p-5">
                <p className="font-semibold text-lg text-vc-blue-dark">
                  📅 Agrégala a tu calendario
                </p>
                <p className="mt-1 mb-4 text-base text-vc-ink/75">
                  Te llegará un aviso una hora antes de cada encuentro.
                </p>
                <BotonesCalendario enlaces={ventana.calendario} compacto />
              </div>
            )}

            {/* 13.1 — la oferta de probar una actividad de la membresía */}
            {ventana.ofrecerPrueba && (
              <div className="mt-6 pt-6 border-t border-vc-cream">
                <p className="flex items-center gap-2 font-semibold text-lg text-vc-blue-dark">
                  <Sparkles className="w-5 h-5 text-vc-orange" aria-hidden="true" />
                  ¿Quieres probar también una actividad de la membresía?
                </p>
                <p className="mt-2 text-base text-vc-ink/75 leading-relaxed">
                  Puedes entrar a una, gratis, para ver cómo son.
                  Es una sola vez: después, para seguir participando, hace falta
                  la membresía.
                </p>
                <ul className="mt-4 space-y-3">
                  {premiumParaProbar.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        disabled={enviando != null}
                        onClick={() => anotarse(a.id, true)}
                        className="w-full text-left rounded-xl border-2 border-vc-cream hover:border-vc-blue p-4 transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange/40 disabled:opacity-60"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-vc-blue-dark">
                            {a.title}
                          </span>
                          {enviando === a.id ? (
                            <Loader2
                              className="w-5 h-5 shrink-0 animate-spin text-vc-blue"
                              aria-hidden="true"
                            />
                          ) : (
                            <ArrowRight
                              className="w-5 h-5 shrink-0 text-vc-blue"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                        <span className="mt-1 block text-base text-vc-ink/70">
                          {a.short_preview}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={cerrar}
                  className="mt-4 min-h-[44px] px-2 text-base text-vc-ink/60 underline hover:text-vc-ink"
                >
                  Ahora no
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------------ */}
      {/* Prueba agotada — el popup de venta                                  */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        abierta={ventana.tipo === "vender"}
        onClose={cerrar}
        titulo="Ya usaste tu actividad de prueba"
      >
        <div className="text-left">
          <p className="flex items-start gap-3 text-lg text-vc-ink/85 leading-relaxed">
            <Lock
              className="w-6 h-6 shrink-0 mt-1 text-vc-orange"
              aria-hidden="true"
            />
            Esta actividad es parte de la membresía. Ya probaste una sin
            suscribirte — para seguir participando de todas, súmate por $30 USD
            al mes.
          </p>
          <p className="mt-4 text-base text-vc-ink/70 leading-relaxed">
            Sin permanencia mínima: cancelas cuando quieras y sigues entrando
            hasta el final del período que pagaste.
          </p>
          <Link href="/membresia" className={`${BTN_SECUNDARIO} mt-5 w-full`}>
            Quiero la membresía
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={cerrar}
            className="mt-3 w-full min-h-[44px] text-base text-vc-ink/60 underline hover:text-vc-ink"
          >
            Ahora no
          </button>
        </div>
      </Modal>

      {/* ------------------------------------------------------------------ */}
      <Modal
        abierta={ventana.tipo === "error"}
        onClose={cerrar}
        titulo="No pudimos inscribirte"
      >
        {ventana.tipo === "error" && (
          <p className="text-left text-lg text-vc-ink/85 leading-relaxed">
            {ventana.mensaje}
          </p>
        )}
      </Modal>
    </div>
  );
}
