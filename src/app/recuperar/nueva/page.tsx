import AuthShell, {
  authInputClass,
  authLabelClass,
  authButtonClass,
} from "@/components/AuthShell";
import { updatePassword } from "@/lib/auth-actions";

export const metadata = {
  title: "Nueva contraseña — Vivir Creciendo",
};

export default async function NuevaPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Nueva contraseña"
      subtitle="Escribe tu nueva contraseña para entrar."
      error={error}
    >
      <form action={updatePassword} className="mt-8 space-y-6">
        <div>
          <label htmlFor="password" className={authLabelClass}>
            Nueva contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Al menos 6 caracteres"
            className={authInputClass}
          />
        </div>

        <button type="submit" className={authButtonClass}>
          Guardar contraseña
        </button>
      </form>
    </AuthShell>
  );
}
