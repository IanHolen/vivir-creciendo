import { CreditCard, Inbox, Info } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { Card, hintClass } from "@/components/admin/ui";
import { PLANES, PROVIDER_LABEL, type PlanKey, type Provider } from "@/lib/payments/plans";

export const metadata = { title: "Suscripciones — Panel de Vivir Creciendo" };
export const dynamic = "force-dynamic";

interface Row {
  id: string;
  user_id: string;
  provider: Provider;
  provider_sub_id: string;
  plan: PlanKey;
  status: string;
  currency: string;
  amount: number;
  paid_until: string | null;
  next_billing_at: string | null;
  cancel_requested_at: string | null;
  created_at: string;
}

function fecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
}

/** Estado legible + color. Los estados crudos difieren por proveedor. */
function estado(r: Row): { label: string; cls: string } {
  const s = r.status;
  if (s === "ACTIVE" || s === "authorized") {
    return r.cancel_requested_at
      ? { label: "Cancelada · vigente", cls: "bg-amber-100 text-amber-900" }
      : { label: "Activa", cls: "bg-green-100 text-green-900" };
  }
  if (s === "APPROVAL_PENDING" || s === "APPROVED" || s === "pending")
    return { label: "Pago no completado", cls: "bg-vc-ink/10 text-vc-ink/70" };
  if (s === "SUSPENDED" || s === "paused") return { label: "Suspendida", cls: "bg-amber-100 text-amber-900" };
  if (s === "CANCELLED" || s === "cancelled" || s === "EXPIRED")
    return r.paid_until && new Date(r.paid_until) > new Date()
      ? { label: "Cancelada · vigente", cls: "bg-amber-100 text-amber-900" }
      : { label: "Cancelada", cls: "bg-red-100 text-red-900" };
  return { label: s, cls: "bg-vc-ink/10 text-vc-ink/70" };
}

export default async function SuscripcionesPage() {
  const { supabase } = await requireAdmin();

  const [{ data: subs }, { data: perfiles }] = await Promise.all([
    supabase.from("subscriptions").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("profiles").select("id, email, full_name, membership_id"),
  ]);
  const rows = (subs ?? []) as Row[];
  const porUsuario = new Map(
    ((perfiles ?? []) as { id: string; email: string | null; full_name: string | null; membership_id: number | null }[]).map((p) => [p.id, p])
  );
  const activas = rows.filter((r) => r.status === "ACTIVE" || r.status === "authorized").length;

  return (
    <>
      <div>
        <h2 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
          Suscripciones
        </h2>
        <p className="mt-1 text-base text-vc-ink/60">
          Lo que PayPal y Mercado Pago nos informan. {activas} {activas === 1 ? "activa" : "activas"} de {rows.length}.
          La membresía de cada socia se activa y se quita sola a partir de esto.
        </p>
      </div>

      <p className={`${hintClass} mt-4 flex items-start gap-2`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Para becas, cortesías o pagos por transferencia sigue sirviendo «Equipo y accesos»:
          una membresía puesta a mano no se toca mientras la persona no tenga una suscripción
          de pago.
        </span>
      </p>

      <Card icon={CreditCard} title="Historial" className="mt-6">
        {rows.length === 0 ? (
          <div className="py-10 text-center">
            <Inbox className="w-10 h-10 mx-auto text-vc-ink/25" aria-hidden="true" />
            <p className="mt-3 text-lg text-vc-ink/70">Todavía nadie ha pagado desde el sitio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-base min-w-[48rem]">
              <thead>
                <tr className="text-left text-sm uppercase tracking-wide text-vc-ink/50 border-b border-vc-cream">
                  <th className="py-2 px-2">Socia</th>
                  <th className="py-2 px-2">Plan</th>
                  <th className="py-2 px-2">Paga con</th>
                  <th className="py-2 px-2">Estado</th>
                  <th className="py-2 px-2">Próximo cobro</th>
                  <th className="py-2 px-2">Acceso hasta</th>
                  <th className="py-2 px-2">Alta</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const p = porUsuario.get(r.user_id);
                  const e = estado(r);
                  return (
                    <tr key={r.id} className="border-b border-vc-cream/70 align-top">
                      <td className="py-3 px-2">
                        <span className="block font-semibold text-vc-blue-dark">{p?.full_name ?? "—"}</span>
                        <span className="block text-sm text-vc-ink/60 break-all">{p?.email ?? r.user_id}</span>
                      </td>
                      <td className="py-3 px-2">
                        {PLANES[r.plan].nombre}
                        <span className="block text-sm text-vc-ink/60">
                          {r.currency === "USD" ? `$${Number(r.amount)} USD` : `$${Number(r.amount).toLocaleString("es-AR")} ARS`}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {PROVIDER_LABEL[r.provider]}
                        <span className="block text-xs text-vc-ink/50 font-mono break-all">{r.provider_sub_id}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${e.cls}`}>{e.label}</span>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">{r.cancel_requested_at ? "—" : fecha(r.next_billing_at)}</td>
                      <td className="py-3 px-2 whitespace-nowrap">{fecha(r.paid_until)}</td>
                      <td className="py-3 px-2 whitespace-nowrap">{fecha(r.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
