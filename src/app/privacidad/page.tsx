import PaginaLegal from "@/components/legal/PaginaLegal";
import { legal } from "@/lib/legal";

export const metadata = {
  title: "Política de privacidad — Vivir Creciendo",
  description: "Qué datos pedimos en Vivir Creciendo, para qué los usamos y cómo los cuidamos.",
};

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      actualizado={legal.actualizado}
      intro="Pedimos pocos datos y los usamos solo para que la comunidad funcione. Aquí te contamos cuáles son, para qué sirven y cómo puedes pedir que los cambiemos o borremos."
    >
      <section>
        <h2>1. Qué datos guardamos</h2>
        <ul>
          <li><strong>Para tu cuenta:</strong> tu nombre y tu correo electrónico, y la contraseña cifrada (nosotras no podemos verla).</li>
          <li><strong>Para tu membresía:</strong> qué plan tienes, desde cuándo, hasta cuándo está pagada y el identificador de la suscripción que nos da PayPal o Mercado Pago. <strong>Nunca recibimos ni guardamos los datos de tu tarjeta.</strong></li>
          <li><strong>Para las actividades:</strong> a cuáles te inscribiste y, si respondes nuestras encuestas, lo que nos cuentes.</li>
          <li><strong>Si lo autorizas:</strong> tu imagen y tus testimonios, como se explica en los <a href="/terminos" className="font-semibold text-vc-blue underline-offset-4 hover:underline">términos y condiciones</a>.</li>
        </ul>
      </section>

      <section>
        <h2>2. Para qué los usamos</h2>
        <ul>
          <li>Darte acceso a las actividades y gestionar tu membresía.</li>
          <li>Enviarte los correos de la comunidad: confirmaciones, recordatorios, el link de cada encuentro y alguna novedad. Puedes pedir que dejemos de enviarte los que no sean imprescindibles.</li>
          <li>Mejorar las actividades a partir de lo que nos cuentas en las encuestas.</li>
        </ul>
        <p>No vendemos tus datos ni los usamos para publicidad de terceros.</p>
      </section>

      <section>
        <h2>3. Quién más los ve</h2>
        <p>
          Solo los servicios que necesitamos para funcionar, cada uno con lo mínimo: Supabase (donde se guarda la base de datos), Vercel (donde vive el sitio), PayPal y Mercado Pago (los pagos), Resend (los correos) y Zoom (los encuentros). Cada uno tiene su propia política de privacidad.
        </p>
      </section>

      <section>
        <h2>4. Cuánto tiempo los guardamos</h2>
        <p>
          Mientras tengas cuenta. Si la cierras, borramos tus datos personales en un plazo razonable; conservamos solo lo que la ley de facturación nos obliga a guardar sobre los pagos.
        </p>
      </section>

      <section>
        <h2>5. Tus derechos</h2>
        <p>
          Puedes ver, corregir o borrar tus datos, y retirar cualquier permiso que nos hayas dado, cuando quieras. Escríbenos a <a href={`mailto:${legal.email}`} className="font-semibold text-vc-blue underline-offset-4 hover:underline">{legal.email}</a> y te respondemos personalmente.
        </p>
      </section>

      <section>
        <h2>6. Responsable</h2>
        <p>
          <strong>{legal.titular}</strong>, {legal.pais}. Contacto: {legal.email}.
        </p>
      </section>
    </PaginaLegal>
  );
}
