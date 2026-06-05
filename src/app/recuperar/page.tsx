import Link from "next/link";
import AuthShell, {
  authInputClass,
  authLabelClass,
  authButtonClass,
} from "@/components/AuthShell";
import { requestPasswordReset } from "@/lib/auth-actions";

export const metadata = {
  title: "Recuperar contraseña — Vivir Creciendo",
};

export default async function RecuperarPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string }>;
}) {
  const { enviado } = await searchParams;

  if (enviado) {
    return (
      <AuthShell
        title="Revisa tu correo"
        notice="Si existe una cuenta con ese correo, te enviamos un enlace para crear una contraseña nueva."
        footer={
          <p>
            <Link
              href="/login"
              className="font-semibold text-vc-orange hover:underline"
            >
              Volver a iniciar sesión
            </Link>
          </p>
        }
      >
        <p className="mt-6 text-center text-base text-vc-blue-dark/70">
          Si no lo ves, revisa la carpeta de correo no deseado (spam).
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para crear una contraseña nueva."
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
      <form action={requestPasswordReset} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className={authLabelClass}>
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            className={authInputClass}
          />
        </div>

        <button type="submit" className={authButtonClass}>
          Enviar enlace
        </button>
      </form>
    </AuthShell>
  );
}
