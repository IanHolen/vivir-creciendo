import PaginaLegal from "@/components/legal/PaginaLegal";
import { legal } from "@/lib/legal";

export const metadata = {
  title: "Términos y condiciones — Vivir Creciendo",
  description: "Las reglas claras de la comunidad Vivir Creciendo: membresía, pagos, cancelación y uso de imagen.",
};

/**
 * Términos y condiciones en lenguaje llano (fundadoras, 17-nov-2026).
 * Incluye el consentimiento de uso de imagen para difusión, que era el motivo
 * principal del pedido. Aviso: no sustituye la revisión de un abogado; los
 * placeholders de lib/legal.ts se completan antes de publicar.
 */
export default function TerminosPage() {
  return (
    <PaginaLegal
      titulo="Términos y condiciones"
      actualizado={legal.actualizado}
      intro="Queremos que sepas exactamente qué puedes esperar de Vivir Creciendo y qué esperamos de ti. Por eso escribimos estas condiciones en lenguaje claro. Si algo no se entiende, escríbenos: preferimos una conversación a una letra chica."
    >
      <section>
        <h2>1. Quiénes somos</h2>
        <p>
          Vivir Creciendo es una comunidad online en español para personas de 65 años o más, creada y conducida por Alejandra Furman-Paz y Nurit Mileris-Zylbersztejn. La titular del servicio es <strong>{legal.titular}</strong>, con sede en <strong>{legal.pais}</strong>. Puedes escribirnos a <a href={`mailto:${legal.email}`} className="font-semibold text-vc-blue underline-offset-4 hover:underline">{legal.email}</a>.
        </p>
      </section>

      <section>
        <h2>2. Qué aceptas al usar el sitio</h2>
        <p>
          Al crear una cuenta o participar en una actividad aceptas estos términos y nuestra <a href="/privacidad" className="font-semibold text-vc-blue underline-offset-4 hover:underline">política de privacidad</a>. Si no estás de acuerdo con algo, te pedimos que no uses el servicio y nos lo cuentes.
        </p>
      </section>

      <section>
        <h2>3. Tu cuenta</h2>
        <ul>
          <li>La cuenta es personal. Pedimos tu nombre y tu correo, nada más.</li>
          <li>Tú cuidas tu contraseña. Si crees que alguien más la conoce, cámbiala o avísanos y te ayudamos.</li>
          <li>Puedes cerrar tu cuenta cuando quieras escribiéndonos.</li>
        </ul>
      </section>

      <section>
        <h2>4. La membresía, los pagos y la prueba gratuita</h2>
        <ul>
          <li>La membresía da acceso a todas las actividades de la comunidad mientras esté activa. Hay un plan mensual y un plan anual; los precios vigentes se muestran siempre en el sitio antes de pagar.</li>
          <li><strong>Los primeros 30 días son gratis.</strong> El primer cobro se hace al terminar ese periodo (en la pre-inscripción de diciembre, en la fecha que se indica al suscribirte). Si cancelas antes, no se te cobra nada.</li>
          <li>Después, la membresía se renueva sola (cada mes o cada año, según tu plan) hasta que la canceles.</li>
          <li>Los pagos se hacen en PayPal o en Mercado Pago. Nosotras nunca vemos ni guardamos los datos de tu tarjeta.</li>
          <li>Los precios pueden cambiar; si eso pasa, te avisamos con anticipación y el cambio aplica desde tu siguiente renovación.</li>
        </ul>
      </section>

      <section>
        <h2>5. Cancelar</h2>
        <p>
          No hay permanencia mínima ni penalización. Cancelas desde tu perfil, sin llamadas ni trámites. Tu membresía sigue activa hasta el final del periodo que ya pagaste y, simplemente, no se genera el cobro siguiente. Si tienes un problema con un cobro, escríbenos y lo resolvemos personalmente.
        </p>
      </section>

      <section>
        <h2>6. Cómo nos cuidamos en la comunidad</h2>
        <p>
          Las actividades son encuentros entre personas reales. Pedimos respeto, escucha y cuidado mutuo. Nadie está obligado a hablar ni a encender la cámara. Lo que se comparte en los encuentros es de quien lo comparte: no se graba ni se difunde lo que otra persona cuenta sin su permiso. Si alguien falta al respeto a la comunidad, podemos pedirle que la deje; en ese caso devolvemos la parte proporcional del periodo no usado.
        </p>
      </section>

      <section>
        <h2>7. Fotos, videos y testimonios: tu imagen</h2>
        <p>
          Nos gusta mostrar lo que pasa en Vivir Creciendo para que otras personas se animen a sumarse. Por eso te pedimos este permiso, que puedes retirar cuando quieras:
        </p>
        <ul>
          <li>Al participar en las actividades, aceptas que podamos tomar <strong>capturas de pantalla, fotos o fragmentos de video</strong> de los encuentros y usarlos en nuestro sitio web, redes sociales, correos y materiales de difusión de Vivir Creciendo.</li>
          <li>Usamos tu nombre de pila (o tu nombre completo solo si tú nos lo autorizas) y, si quieres, tu ciudad y tu edad.</li>
          <li>Los <strong>testimonios</strong> que nos envíes por escrito, en audio o en video pueden publicarse con los mismos fines, tal como los diste o con pequeños ajustes de redacción que no cambien su sentido.</li>
          <li>No usamos tu imagen para nada ajeno a Vivir Creciendo ni la vendemos a terceros.</li>
          <li><strong>Si prefieres no aparecer</strong>, dínoslo en cualquier momento (en el encuentro, por correo o por WhatsApp) y lo respetamos: no te incluiremos y retiraremos lo que ya se haya publicado en un plazo razonable. Esto no afecta tu membresía.</li>
        </ul>
      </section>

      <section>
        <h2>8. Contenidos y propiedad intelectual</h2>
        <p>
          Los materiales de las actividades (guías, presentaciones, grabaciones cuando las haya) son para tu uso personal dentro de la comunidad. Te pedimos no copiarlos ni compartirlos fuera de ella. Las películas que proponemos en Cine Reflexión se ven por los medios legales que cada persona tenga disponibles.
        </p>
      </section>

      <section>
        <h2>9. Lo que no podemos prometer</h2>
        <p>
          Hacemos lo posible para que el sitio y los encuentros funcionen siempre bien, pero a veces hay fallas técnicas ajenas a nosotras (internet, Zoom, el proveedor de pagos). Las actividades de salud y bienestar son espacios de información y acompañamiento: no reemplazan la consulta con tu médico.
        </p>
      </section>

      <section>
        <h2>10. Cambios a estos términos</h2>
        <p>
          Si cambiamos algo importante, te lo avisamos por correo antes de que entre en vigor. La fecha de la última actualización está arriba de esta página.
        </p>
      </section>

      <section>
        <h2>11. Dónde se aplican</h2>
        <p>
          Estos términos se rigen por las leyes de <strong>{legal.pais}</strong>. Ante cualquier diferencia, el primer paso siempre será conversar: escríbenos a <a href={`mailto:${legal.email}`} className="font-semibold text-vc-blue underline-offset-4 hover:underline">{legal.email}</a>.
        </p>
      </section>
    </PaginaLegal>
  );
}
