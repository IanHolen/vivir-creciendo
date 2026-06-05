import Link from "next/link";
import AuthShell, {
  authInputClass,
  authLabelClass,
  authButtonClass,
} from "@/components/AuthShell";
import { login } from "@/lib/auth-actions";

export const metadata = {
  title: "Iniciar sesión — Vivir Creciendo",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Bienvenido de vuelta a tu comunidad."
      error={error}
      footer={
        <>
          <p>
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="font-semibold text-vc-orange hover:underline"
            >
              Regístrate
            </Link>
          </p>
          <p>
            <Link
              href="/recuperar"
              className="text-vc-blue-dark/70 hover:text-vc-orange hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </>
      }
    >
      <form action={login} className="mt-8 space-y-6">
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
            autoComplete="current-password"
            placeholder="Tu contraseña"
            className={authInputClass}
          />
        </div>

        <button type="submit" className={authButtonClass}>
          Entrar
        </button>
      </form>
    </AuthShell>
  );
}
