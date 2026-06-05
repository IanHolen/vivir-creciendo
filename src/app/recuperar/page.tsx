import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: "Recuperar contraseña — Vivir Creciendo",
};

/**
 * Recuperar contraseña — interino (contrato back 64a815fb).
 * El auto-servicio por correo (resetPasswordForEmail) requiere SMTP propio,
 * que todavía no está configurado. Mientras tanto, recuperación asistida:
 * la persona escribe al equipo y un admin le fija una contraseña nueva
 * (Edge Function admin-set-password, disponible en el panel admin).
 */
export default function RecuperarPage() {
  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te ayudamos a recuperar tu acceso."
      footer={
        <p>
          <Link
            href="/login"
            className="text-vc-blue-dark/70 hover:text-vc-orange hover:underline"
          >
            ← Volver a iniciar sesión
          </Link>
        </p>
      }
    >
      <div className="mt-6 space-y-4 text-lg text-vc-blue-dark/80 leading-relaxed">
        <p>
          Por ahora, para crear una contraseña nueva, escríbenos y te ayudamos
          enseguida:
        </p>
        <a
          href={`mailto:${siteConfig.email}?subject=Recuperar%20mi%20contrase%C3%B1a`}
          className="block w-full text-center min-h-[56px] px-6 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
        >
          Escribir a {siteConfig.email}
        </a>
        <p className="text-base text-vc-blue-dark/60">
          Muy pronto vas a poder cambiarla tú mismo desde aquí.
        </p>
      </div>
    </AuthShell>
  );
}
