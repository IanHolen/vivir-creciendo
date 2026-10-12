"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlanKey, isProvider, PLANES } from "@/lib/payments/plans";
import { crearSuscripcionPayPal, cancelarSuscripcionPayPal, paypalConfigurado } from "@/lib/payments/paypal";
import { crearSuscripcionMP, cancelarSuscripcionMP, mercadoPagoConfigurado } from "@/lib/payments/mercadopago";
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
    redirect("/membresia?error=" + encodeURIComponent("Elige un plan y una forma de pago."));
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
  let destino: string;

  try {
    if (provider === "paypal") {
      if (!paypalConfigurado) throw new Error("PayPal no está configurado.");
      const sub = await crearSuscripcionPayPal({
        plan,
        userId: user.id,
        email: user.email ?? null,
        nombre: perfil?.full_name ?? null,
        returnUrl: `${siteUrl()}/membresia/retorno?proveedor=paypal`,
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
      if (!mercadoPagoConfigurado) throw new Error("Mercado Pago no está configurado.");
      if (!user.email) throw new Error("Tu cuenta no tiene correo.");
      const sub = await crearSuscripcionMP({
        plan,
        userId: user.id,
        email: user.email,
        backUrl: `${siteUrl()}/membresia/retorno?proveedor=mercadopago`,
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
    redirect(
      "/membresia?error=" +
        encodeURIComponent(
          "No pudimos abrir la página de pago. Intenta de nuevo en un momento o escríbenos."
        )
    );
  }

  redirect(destino);
}

/** La suscripción vigente (o la última) del usuario con sesión. */
async function suscripcionVigenteDe(userId: string): Promise<SubscriptionRow | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);
  const rows = (data ?? []) as SubscriptionRow[];
  return (
    rows.find((r) => r.status === "ACTIVE" || r.status === "authorized") ??
    rows.find((r) => r.status === "APPROVAL_PENDING" || r.status === "pending") ??
    rows[0] ??
    null
  );
}

export async function cancelarSuscripcion() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");

  const sub = await suscripcionVigenteDe(user.id);
  if (!sub || !(sub.status === "ACTIVE" || sub.status === "authorized")) {
    redirect("/perfil?error=" + encodeURIComponent("No tienes una membresía activa para cancelar."));
  }

  try {
    if (sub.provider === "paypal") {
      await cancelarSuscripcionPayPal(sub.provider_sub_id, "Cancelada por la socia desde el sitio");
    } else {
      await cancelarSuscripcionMP(sub.provider_sub_id);
    }
  } catch (e) {
    console.error("[suscripcion] no se pudo cancelar:", e);
    redirect(
      "/perfil?error=" +
        encodeURIComponent("No pudimos cancelar en este momento. Intenta de nuevo o escríbenos.")
    );
  }

  // El proveedor ya la cerró; se refleja acá sin esperar el webhook (que de
  // todos modos va a llegar y a confirmar lo mismo). El acceso sigue hasta
  // paid_until: eso lo respeta sync_membership_from_subscriptions().
  const admin = createAdminClient();
  const paidUntil =
    sub.paid_until ??
    (sub.next_billing_at ? conGracia(new Date(sub.next_billing_at)).toISOString() : null);
  await admin
    .from("subscriptions")
    .update({
      status: sub.provider === "paypal" ? "CANCELLED" : "cancelled",
      cancel_requested_at: new Date().toISOString(),
      ...(paidUntil ? { paid_until: paidUntil } : {}),
    })
    .eq("id", sub.id);
  await sincronizarAcceso(user.id);

  revalidatePath("/perfil");
  revalidatePath("/");
  redirect(
    "/perfil?ok=" +
      encodeURIComponent(
        "Tu membresía quedó cancelada. Sigues participando hasta el final del período que ya pagaste."
      )
  );
}
