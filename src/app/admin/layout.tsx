import { Suspense } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import AdminNav from "@/components/admin/AdminNav";
import Flash from "@/components/admin/Flash";
import { btnPrimary } from "@/components/admin/ui";

export const metadata = {
  title: "Panel de administración — Vivir Creciendo",
};

/**
 * Cascarón del panel: la puerta de admin, la barra superior y las pestañas.
 *
 * El chequeo de permisos vive acá y no en cada página — antes estaba metido en
 * el mismo archivo de 658 líneas que el formulario, y cualquier vista nueva
 * nacía sin protección. Las server actions revalidan con
 * revalidatePath("/admin", "layout") para refrescar todo el árbol.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-vc-cream noise-overlay flex items-center justify-center px-4 py-16">
        <div className="relative z-10 max-w-md text-center bg-white rounded-3xl shadow-xl p-10">
          <h1 className="font-(family-name:--font-display) text-2xl font-black text-vc-blue-dark uppercase">
            Acceso restringido
          </h1>
          <p className="mt-3 text-lg text-vc-ink/70">
            Esta sección es solo para administradores.
          </p>
          <Link href="/" className={`${btnPrimary} mt-6`}>
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-vc-cream noise-overlay">
      <div className="relative z-10">
        <header className="bg-white border-b border-vc-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-widest text-vc-orange">
                Panel de administración
              </p>
              <h1 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
                Vivir Creciendo
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-base text-vc-ink/60 truncate max-w-[16rem]">
                {user.email}
              </span>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lg font-semibold text-vc-blue hover:text-vc-orange"
              >
                Ver el sitio
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <AdminNav />
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <Suspense fallback={null}>
            <Flash />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}
