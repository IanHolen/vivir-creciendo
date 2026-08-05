"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Plus, ShieldCheck } from "lucide-react";

const NUEVA = "/admin/actividades/nueva";

const tabs = [
  { href: "/admin", label: "Actividades", icon: CalendarDays },
  { href: NUEVA, label: "Nueva actividad", icon: Plus },
  { href: "/admin/equipo", label: "Equipo y accesos", icon: ShieldCheck },
];

/**
 * "Actividades" queda activa también al editar una (/admin/actividades/[id]),
 * pero no al crear una nueva — esa tiene su propia pestaña.
 */
function isActive(href: string, pathname: string): boolean {
  if (href !== "/admin") return pathname === href;
  if (pathname === NUEVA) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/actividades/");
}

/**
 * Navegación del panel. Cliente porque necesita usePathname para marcar la
 * pestaña activa; el resto del panel sigue siendo Server Components.
 */
export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones del panel" className="border-b border-vc-cream">
      <ul className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-4 text-lg font-semibold border-b-[3px] -mb-px transition-colors ${
                  active
                    ? "border-vc-orange text-vc-blue-dark"
                    : "border-transparent text-vc-ink/60 hover:text-vc-blue-dark hover:border-vc-cream"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
