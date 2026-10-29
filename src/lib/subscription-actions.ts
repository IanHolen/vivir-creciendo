"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlanKey, isProvider, PLANES } from "@/lib/payments/plans";
import { crearSuscripcionPayPal, cancelarSuscripcionPayPal, paypalConfigurado } from "@/lib/payments/paypal";
import { crearSuscripcionMP, cancelarSuscripcionMP, mercadoPagoListo } from "@/lib/payments/mercadopago";
import { conGracia, sincronizarAcceso, type SubscriptionRow } from "@/lib/payments/access";

/**
 * Alta y baja de la membresía desde el sitio.
 *
 * `iniciarSuscripcion` crea la suscripción en el proveedor y manda a la socia
 * a SU página de pago (PayPal o Mercado Pago). Nunca pedimos la tarjeta acá.
 * El acceso no se otorga al volver: lo otorga el webhook (y, como refuerzo,
 * la página de retorno consulta al proveedor).
 */

function siteUrl(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL;
  if (!u) throw new Error("Falta NEXT_PUBLIC_SITE_URL.");
  return u.replace(/\/$/, "");
}

export async function iniciarSuscripcion(formData: FormData) {
  const plan = formData.get("plan");
  const provider = formData.get("proveedor");
  if (!isPlanKey(plan) || !isProvider(provider)) {
    redirect("/membresia?error=datos");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/membresia?plan=${plan}`)}`);

  const { data: perfil } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const admin = createAdminClient();

  // Una sola suscripción activa por persona. La página ya lo evita, pero dos
  // pestañas abiertas (o un webhook que llega entre medio) no se enteran.
  const { data: activa } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .in("status", ["ACTIVE", "authorized"])
    .limit(1)
    .maybeSingle();
  if (activa) redirect("/perfil?ok=ya-activa");

  let destino: string;

  try {
    if (provider === "paypal") {
      if (!paypalConfigurado) throw new Error("PayPal no está configurado.");
      const sub = await crearSuscripcionPayPal({
        plan,
        userId: user.id,
        email: user.email ?? null,
        nombre: perfil?.full_name ?? null,
        returnUrl: `${siteUrl()}/membresia/retorno/paypal`,
        cancelUrl: `${siteUrl()}/membresia?cancelado=1`,
      });
      const { error } = await admin.from("subscriptions").insert({
        user_id: user.id,
        provider: "paypal",
        provider_sub_id: sub.id,
        plan,
        status: sub.status,
        currency: "USD",
        amount: PLANES[plan].usd,
      });
      if (error) throw error;
      destino = sub.approveUrl;
    } else {
      if (!(await mercadoPagoListo())) throw new Error("Mercado Pago no está configurado (credenciales o precios en ARS).");
      if (!user.email) throw new Error("Tu cuenta no tiene correo.");
      const sub = await crearSuscripcionMP({
        plan,
        userId: user.id,
        email: user.email,
        backUrl: `${siteUrl()}/membresia/retorno/mercadopago`,
      });
      const { error } = await admin.from("subscriptions").insert({
        user_id: user.id,
        provider: "mercadopago",
        provider_sub_id: sub.id,
        plan,
        status: sub.status,
        currency: "ARS",
        amount: sub.monto,
      });
      if (error) throw error;
      destino = sub.initPoint;
    }
  } catch (e) {
    console.error("[suscripcion] no se pudo iniciar:", e);
    redirect("/membresia?error=proveedor");
  }

  redirect(destino);
}

export async function cancelarSuscripcion() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");

  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["ACTIVE", "authorized", "SUSPENDED", "paused"]);
  const activas = (data ?? []) as SubscriptionRow[];

  if (activas.length === 0) {
    // Doble clic o ya cancelada desde el proveedor: no es un error para la socia.
    const { data: ultima } = await admin
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const st = ultima?.status;
    if (st === "CANCELLED" || st === "cancelled" || st === "EXPIRED") redirect("/perfil?ok=cancelada");
    redirect("/perfil?error=no-activa");
  }

  // Si por alguna razón hubiera más de una (dos pestañas), se cancelan todas:
  // dejar una cobrando "a escondidas" es el peor resultado posible.
  for (const sub of activas) {
    try {
      if (sub.provider === "paypal") {
        await cancelarSuscripcionPayPal(sub.provider_sub_id, "Cancelada por la socia desde el sitio");
      } else {
        await cancelarSuscripcionMP(sub.provider_sub_id);
      }
    } catch (e) {
      console.error("[suscripcion] no se pudo cancelar:", sub.provider_sub_id, e);
      redirect("/perfil?error=cancelar");
    }

    // El proveedor ya la cerró; se refleja acá sin esperar el webhook (que de
    // todos modos va a llegar y confirmar lo mismo). El acceso sigue hasta
    // paid_until: eso lo respeta sync_membership_from_subscriptions().
    const paidUntil =
      sub.paid_until ??
      (sub.next_billing_at ? conGracia(new Date(sub.next_billing_at)).toISOString() : null);
    await admin
      .from("subscriptions")
      .update({
        status: sub.provider === "paypal" ? "CANCELLED" : "cancelled",
        cancel_requested_at: new Date().toISOString(),
        ...(paidUntil && !sub.paid_until ? { paid_until: paidUntil } : {}),
      })
      .eq("id", sub.id);
  }
  await sincronizarAcceso(user.id);

  revalidatePath("/perfil");
  revalidatePath("/");
  redirect("/perfil?ok=cancelada");
}
