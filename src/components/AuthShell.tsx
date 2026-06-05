import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";

/** Layout compartido para las pantallas de cuenta (login / registro / recuperar). */
export default function AuthShell({
  title,
  subtitle,
  error,
  notice,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  error?: string;
  notice?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
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
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-center text-lg text-vc-blue-dark/70 leading-relaxed">
              {subtitle}
            </p>
          )}

          {notice && (
            <p
              role="status"
              className="mt-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-base text-green-800 text-center"
            >
              {notice}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-700 text-center"
            >
              {error}
            </p>
          )}

          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-base text-vc-blue-dark/70 space-y-2">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}

export const authInputClass =
  "mt-2 w-full min-h-[56px] px-4 py-3 text-lg rounded-xl border-2 border-vc-cream focus:border-vc-orange focus:outline-none focus-visible:ring-4 focus-visible:ring-vc-orange/40 text-vc-blue-dark";
export const authLabelClass = "block text-lg font-medium text-vc-blue-dark";
export const authButtonClass =
  "w-full inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg";
