import { AlertTriangle, Banknote, CreditCard, Inbox, Info } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { Card, Field, TextInput, btnPrimary, hintClass } from "@/components/admin/ui";
import { mercadoPagoCredenciales } from "@/lib/payments/mercadopago";
import { obtenerPreciosArs, preciosCompletos } from "@/lib/payments/precios-ars";
import { guardarPreciosArs } from "@/lib/precios-actions";
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
  cancel_reason?: string | null;
  created_at: string;
}

/** Cobro de una suscripción cerrada por duplicada: hay que reembolsarlo. */
interface CobroDuplicado {
  subscription_id: string;
  provider: Provider;
  provider_payment_id: string;
  amount: number | null;
  currency: string | null;
  paid_at: string | null;
}

function fecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
}

/** Estado legible + color. Los estados crudos difieren por proveedor. */
function estado(r: Row): { label: string; cls: string } {
  const s = r.status;
  if (r.cancel_reason === "duplicada") return { label: "Duplicada · cerrada", cls: "bg-red-100 text-red-900" };
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

  const [{ data: subs }, { data: perfiles }, preciosArs, { data: dupData }] = await Promise.all([
    supabase.from("subscriptions").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("profiles").select("id, email, full_name, membership_id"),
    obtenerPreciosArs(),
    supabase
      .from("subscription_payments")
      .select("subscription_id, provider, provider_payment_id, amount, currency, paid_at")
      .eq("status", "duplicado")
      .order("paid_at", { ascending: false }),
  ]);
  const duplicados = (dupData ?? []) as CobroDuplicado[];
  const mpActivo = mercadoPagoCredenciales && preciosCompletos(preciosArs);
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

      <Card
        icon={Banknote}
        title="Precios en pesos (Mercado Pago)"
        hint="PayPal cobra en dólares los precios de la web. Mercado Pago cobra en pesos argentinos: estos son los montos. Si quedan vacíos, en la página de pago solo aparece PayPal."
        className="mt-6"
      >
        <form action={guardarPreciosArs} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(Object.keys(PLANES) as PlanKey[]).map((plan) => (
            <Field
              key={plan}
              label={`${PLANES[plan].nombre} — en pesos`}
              hint={`Hoy en dólares: ${PLANES[plan].usdLabel}.`}
            >
              <TextInput
                name={`precio_${plan}`}
                type="text"
                inputMode="numeric"
                placeholder={plan === "mensual" ? "Ej.: 30000" : "Ej.: 270000"}
                defaultValue={preciosArs[plan] ?? ""}
                required
              />
            </Field>
          ))}
          <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
            <button type="submit" className={btnPrimary}>Guardar precios</button>
            <span className={hintClass}>
              {mpActivo
                ? "Mercado Pago está activo con estos montos. El cambio aplica a quien se suscriba a partir de ahora; las suscripciones ya activas siguen con su monto."
                : mercadoPagoCredenciales
                  ? "Mercado Pago está apagado hasta que guardes los dos precios."
                  : "Mercado Pago no tiene credenciales en este entorno; los precios se guardan igual."}
            </span>
          </div>
        </form>
      </Card>

      {duplicados.length > 0 && (
        <div role="alert" className="mt-6 rounded-2xl border-2 border-red-200 bg-red-50 p-6">
          <p className="flex items-center gap-2 text-lg font-bold text-red-900">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            {duplicados.length === 1 ? "Hay un cobro duplicado para reembolsar" : `Hay ${duplicados.length} cobros duplicados para reembolsar`}
          </p>
          <p className="mt-2 text-base text-red-900/80 leading-relaxed">
            Alguien terminó con dos suscripciones a la vez (por ejemplo, pagó en dos pestañas). La
            segunda ya quedó cancelada y su membresía sigue activa con la primera, pero lo que se
            le cobró en la segunda hay que devolverlo desde {duplicados.some((d) => d.provider === "paypal") ? "PayPal" : "Mercado Pago"}
            {duplicados.some((d) => d.provider === "paypal") && duplicados.some((d) => d.provider === "mercadopago") ? " y Mercado Pago" : ""}.
            Cuando el reembolso queda registrado, sale de esta lista.
          </p>
          <ul className="mt-4 space-y-2">
            {duplicados.map((d) => {
              const sub = rows.find((r) => r.id === d.subscription_id);
              const p = sub ? porUsuario.get(sub.user_id) : undefined;
              return (
                <li key={`${d.provider}-${d.provider_payment_id}`} className="rounded-xl bg-white px-4 py-3 text-base">
                  <span className="font-semibold text-vc-blue-dark">{p?.full_name ?? p?.email ?? "—"}</span>
                  {" · "}
                  {d.amount != null ? `$${Number(d.amount).toLocaleString("es-AR")} ${d.currency ?? ""}` : "monto —"}
                  {" · "}
                  {PROVIDER_LABEL[d.provider]} · {fecha(d.paid_at)}
                  <span className="block text-xs text-vc-ink/50 font-mono break-all">Cobro {d.provider_payment_id}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

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
