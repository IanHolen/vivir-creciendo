import { socialProof } from "@/lib/content";

/**
 * Sección 02 — Strip de prueba social.
 *
 * Barra estrecha en azul marca que rompe visualmente el hero y da
 * credibilidad rápida antes de que el visitante siga bajando.
 *
 * El número de miembros está apagado a propósito (`socialProof.memberCount`
 * en null): Alejandra dejó un comentario en el doc preguntando qué poner ahí,
 * así que la cifra todavía no está confirmada. En cuanto la definan, basta
 * con poner el número en content.ts y la frase aparece sola.
 *
 * COLOR: la banda va en naranja (pedido de Ian, 5 ago). Usa `vc-orange-dark`
 * (#B8441F) y no el naranja de marca (#D85A35): en blanco sobre #D85A35 el
 * contraste es 3.86:1, y este texto es de 16-18px, o sea texto normal, que
 * necesita 4.5:1. Sobre #B8441F sube a 5.4:1. El doc marca el 4.5:1 como
 * requisito explícito para este público.
 */
export default function SocialProof() {
  const items = [
    ...(socialProof.memberCount
      ? [`Comunidad en crecimiento con ${socialProof.memberCount} miembros activos`]
      : []),
    ...socialProof.items,
  ];

  return (
    <section className="bg-vc-orange-dark text-white px-4 sm:px-6 lg:px-8 py-6">
      <ul className="max-w-6xl mx-auto flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-8 text-base md:text-lg font-medium">
            {i > 0 && (
              <span className="hidden sm:inline text-white/40" aria-hidden="true">
                ·
              </span>
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
