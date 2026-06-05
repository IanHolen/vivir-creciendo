import Link from "next/link";
import AuthShell, {
  authInputClass,
  authLabelClass,
  authButtonClass,
} from "@/components/AuthShell";
import { signup } from "@/lib/auth-actions";

export const metadata = {
  title: "Crear cuenta — Vivir Creciendo",
};

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Crear cuenta"
      subtitle="Únete a la comunidad de Vivir Creciendo."
      error={error}
      footer={
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-vc-orange hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form action={signup} className="mt-8 space-y-6">
        <div>
          <label htmlFor="name" className={authLabelClass}>
            Tu nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Cómo te llamas"
            className={authInputClass}
          />
        </div>

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

        <div>
          <label htmlFor="password" className={authLabelClass}>
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Al menos 8 caracteres"
            className={authInputClass}
          />
        </div>

        <button type="submit" className={authButtonClass}>
          Crear mi cuenta
        </button>
      </form>
    </AuthShell>
  );
}
