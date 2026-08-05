import Link from "next/link";
import { Plus, Search, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { PLAN_META, PLAN_ORDER, normalizePlan, planMeta } from "@/lib/activities";
import { btnPrimary, btnGhost, inputClass } from "@/components/admin/ui";
import ActivityList, {
  type ActivityRow,
} from "@/components/admin/ActivityList";
import type { AdminActivity } from "@/components/admin/ActivityForm";

/** Compara sin acentos ni mayúsculas, para que "memoria" encuentre "Memória". */
function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Mismo criterio de orden que usa moveActivity al reescribir sort_order. */
function compareForOrder(a: AdminActivity, b: AdminActivity) {
  const sa = a.sort_order ?? Number.MAX_SAFE_INTEGER;
  const sb = b.sort_order ?? Number.MAX_SAFE_INTEGER;
  if (sa !== sb) return sa - sb;
  return a.title.localeCompare(b.title, "es");
}

/** Solo lo que la fila necesita: el resto no tiene por qué cruzar al cliente. */
function toRow(a: AdminActivity): ActivityRow {
  const meta = planMeta(a.plan);
  return {
    id: a.id,
    title: a.title,
    is_active: a.is_active,
    image_url: a.image_url,
    fecha: a.fecha,
    hora: a.hora,
    facilitador: a.facilitador,
    planLabel: meta?.label ?? null,
    planBadgeClass: meta?.badgeClass ?? null,
  };
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-vc-cream px-5 py-4">
      <p className="font-(family-name:--font-display) text-3xl font-black text-vc-blue-dark leading-none">
        {value}
      </p>
      <p className="mt-1 text-base text-vc-ink/60">{label}</p>
    </div>
  );
}

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; plan?: string }>;
}) {
  const { q = "", estado = "", plan = "" } = await searchParams;
  const { supabase } = await requireAdmin();

  const { data } = await supabase.from("activities").select("*");
  const all = ((data ?? []) as AdminActivity[]).sort(compareForOrder);

  // Los filtros son solo de vista: mover una actividad sigue operando sobre la
  // lista completa, así que con filtro activo se apagan las DOS formas de
  // reordenar, el arrastre y las flechas (mover algo respecto de una lista
  // recortada es la forma más rápida de desordenar todo).
  const filtering = Boolean(q || estado || plan);
  const needle = fold(q.trim());
  const rows = all.filter((a) => {
    if (estado === "visible" && !a.is_active) return false;
    if (estado === "oculta" && a.is_active) return false;
    if (plan === "sin" && normalizePlan(a.plan) !== null) return false;
    if (plan && plan !== "sin" && normalizePlan(a.plan) !== plan) return false;
    if (!needle) return true;
    return [a.title, a.short_preview, a.facilitador, a.fecha]
      .filter(Boolean)
      .some((v) => fold(String(v)).includes(needle));
  });

  const visibles = all.filter((a) => a.is_active).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
            Actividades
          </h2>
          <p className="mt-1 text-base text-vc-ink/60">
            Lo que cargues acá es lo que se ve en la portada y en{" "}
            <code className="text-vc-blue">/actividades/…</code>. Ya no hay
            catálogo escrito en el código: esta lista es la única.
          </p>
        </div>
        <Link href="/admin/actividades/nueva" className={btnPrimary}>
          <Plus className="w-5 h-5" aria-hidden="true" />
          Nueva actividad
        </Link>
      </div>

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat value={all.length} label="en total" />
        <Stat value={visibles} label="visibles" />
        <Stat value={all.length - visibles} label="ocultas" />
        <Stat
          value={all.filter((a) => normalizePlan(a.plan) === "gratuita").length}
          label="gratuitas"
        />
      </div>

      {/* Filtros — form GET, sin JavaScript */}
      <form
        method="get"
        className="mt-6 bg-white rounded-2xl border border-vc-cream p-4 flex flex-col sm:flex-row gap-3 sm:items-end"
      >
        <label className="flex-1 min-w-0">
          <span className="sr-only">Buscar actividad</span>
          <span className="relative block">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vc-ink/40"
              aria-hidden="true"
            />
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Buscar por título, facilitadora o fecha"
              className={`${inputClass} pl-12`}
            />
          </span>
        </label>
        <label>
          <span className="sr-only">Filtrar por estado</span>
          <select name="estado" defaultValue={estado} className={inputClass}>
            <option value="">Todos los estados</option>
            <option value="visible">Solo visibles</option>
            <option value="oculta">Solo ocultas</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrar por acceso</span>
          <select name="plan" defaultValue={plan} className={inputClass}>
            <option value="">Todos los accesos</option>
            {PLAN_ORDER.map((k) => (
              <option key={k} value={k}>
                {PLAN_META[k].label}
              </option>
            ))}
            <option value="sin">Sin definir</option>
          </select>
        </label>
        <button type="submit" className={btnGhost}>
          Filtrar
        </button>
        {filtering && (
          <Link href="/admin" className={btnGhost}>
            Limpiar
          </Link>
        )}
      </form>

      {/* Listado */}
      {rows.length === 0 ? (
        <div className="mt-6 bg-white rounded-2xl border border-vc-cream p-10 text-center">
          <Inbox className="w-10 h-10 mx-auto text-vc-ink/25" aria-hidden="true" />
          <p className="mt-3 text-lg text-vc-ink/70">
            {filtering
              ? "Ninguna actividad coincide con ese filtro."
              : "Todavía no hay actividades cargadas."}
          </p>
          {filtering ? (
            <Link href="/admin" className={`${btnGhost} mt-5`}>
              Ver todas
            </Link>
          ) : (
            <Link href="/admin/actividades/nueva" className={`${btnPrimary} mt-5`}>
              <Plus className="w-5 h-5" aria-hidden="true" />
              Crear la primera
            </Link>
          )}
        </div>
      ) : (
        <ActivityList
          rows={rows.map(toRow)}
          total={all.length}
          filtering={filtering}
        />
      )}

      {filtering && rows.length > 0 && (
        <p className="mt-4 text-base text-vc-ink/60">
          Mostrando {rows.length} de {all.length}. Para reordenar (arrastrando o
          con las flechas) hay que quitar los filtros.
        </p>
      )}
    </>
  );
}
