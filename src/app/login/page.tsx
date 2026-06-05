import Link from "next/link";
import Logo from "@/components/Logo";
import { login } from "@/lib/auth-actions";

export const metadata = {
  title: "Iniciar sesión — Vivir Creciendo",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-vc-cream noise-overlay flex items-center justify-center px-4 py-16">
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center">
          <Link
            href="/"
            className="focus-visible:ring-4 focus-visible:ring-vc-orange rounded-lg"
          >
            <Logo className="h-14 w-auto" />
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
            Iniciar sesión
          </h1>
          <p className="mt-3 text-center text-lg text-vc-blue-dark/70 leading-relaxed">
            Bienvenido de vuelta a tu comunidad.
          </p>

          <form action={login} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-vc-blue-dark"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tucorreo@ejemplo.com"
                className="mt-2 w-full min-h-[56px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 text-vc-blue-dark"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-vc-blue-dark"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Tu contraseña"
                className="mt-2 w-full min-h-[56px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 text-vc-blue-dark"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-center text-base text-vc-blue-dark/70">
            ¿Todavía no eres parte?{" "}
            <Link
              href="/#membresias"
              className="font-semibold text-vc-orange hover:underline focus-visible:ring-4 focus-visible:ring-vc-orange rounded"
            >
              Conoce las membresías
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-vc-blue-dark/70 hover:text-vc-orange text-base focus-visible:ring-4 focus-visible:ring-vc-orange rounded px-2 py-1"
          >
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
