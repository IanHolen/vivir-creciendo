import Link from "next/link";
import AuthShell, {
  authInputClass,
  authLabelClass,
} from "@/components/AuthShell";
import { login } from "@/lib/auth-actions";

export const metadata = {
  title: "Entrar — Vivir Creciendo",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Bienvenido"
      subtitle="Crea tu cuenta para unirte a la comunidad."
      error={error}
      footer={
        <p>
          <Link
            href="/recuperar"
            className="text-vc-blue-dark/70 hover:text-vc-orange hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      }
    >
      {/* Registrarse — acción prioritaria, arriba y prominente. */}
      <div className="mt-8 rounded-2xl bg-vc-cream/60 border border-vc-cream p-6 text-center">
        <p className="text-lg font-medium text-vc-blue-dark">
          ¿Todavía no eres parte?
        </p>
        <Link
          href="/registro"
          className="mt-4 w-full inline-flex items-center justify-center min-h-[60px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-bold text-xl rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
        >
          Crear mi cuenta
        </Link>
      </div>

      {/* Separador */}
      <div className="mt-8 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-grow bg-vc-cream" />
        <span className="text-base text-vc-blue-dark/60">
          ¿Ya tienes cuenta?
        </span>
        <span className="h-px flex-grow bg-vc-cream" />
      </div>

      {/* Iniciar sesión — debajo, secundario. */}
      <form action={login} className="mt-6 space-y-5">
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

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center min-h-[56px] px-8 py-4 border-2 border-vc-blue text-vc-blue-dark hover:bg-vc-blue hover:text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
        >
          Iniciar sesión
        </button>
      </form>
    </AuthShell>
  );
}
