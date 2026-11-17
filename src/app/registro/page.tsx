import Link from "next/link";
import { destinoSeguro } from "@/lib/safe-redirect";
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
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const destino = destinoSeguro(next, "") ;

  return (
    <AuthShell
      title="Crear cuenta"
      subtitle="Únete a la comunidad de Vivir Creciendo."
      error={error}
      footer={
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link
            href={destino ? `/login?next=${encodeURIComponent(destino)}` : "/login"}
            className="font-semibold text-vc-orange hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form action={signup} className="mt-8 space-y-6">
        {destino && <input type="hidden" name="next" value={destino} />}
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

        <label className="flex items-start gap-3 text-base text-vc-ink/85 leading-snug cursor-pointer">
          <input
            type="checkbox"
            name="acepta"
            required
            className="mt-1 w-6 h-6 shrink-0 rounded border-2 border-vc-cream accent-vc-orange focus-visible:ring-4 focus-visible:ring-vc-orange/30"
          />
          <span>
            Leí y acepto los{" "}
            <a href="/terminos" target="_blank" rel="noopener" className="font-semibold text-vc-blue underline-offset-4 hover:underline">términos y condiciones</a>{" "}
            y la{" "}
            <a href="/privacidad" target="_blank" rel="noopener" className="font-semibold text-vc-blue underline-offset-4 hover:underline">política de privacidad</a>, incluido el permiso para usar mi imagen en la difusión de la comunidad.
          </span>
        </label>

        <button type="submit" className={authButtonClass}>
          Crear mi cuenta
        </button>
      </form>
    </AuthShell>
  );
}
