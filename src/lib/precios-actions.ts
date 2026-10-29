"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { PLANES, type PlanKey } from "@/lib/payments/plans";
import { ARS_MINIMO, CLAVES_ARS, parsearArs } from "@/lib/payments/precios-ars";

/**
 * Guardar los precios en pesos de Mercado Pago desde /admin/suscripciones.
 *
 * Doble cerradura como el resto del panel: la RLS de `site_settings` exige
 * is_admin() y además acá se verifica antes de escribir. Los dos precios se
 * guardan juntos: mientras falte uno, Mercado Pago sigue apagado en
 * /membresia y solo se puede pagar con PayPal.
 */
export async function guardarPreciosArs(formData: FormData) {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/suscripciones?error=" + encodeURIComponent("No tienes permisos de administrador."));

  const valores: Partial<Record<PlanKey, number>> = {};
  for (const plan of Object.keys(PLANES) as PlanKey[]) {
    const n = parsearArs(formData.get(`precio_${plan}`));
    if (n == null) {
      redirect(
        "/admin/suscripciones?error=" +
          encodeURIComponent(
            `El precio ${PLANES[plan].nombre.toLowerCase()} tiene que ser un número entero de al menos $${ARS_MINIMO.toLocaleString("es-AR")} ARS, sin centavos.`
          )
      );
    }
    valores[plan] = n;
  }

  const filas = (Object.keys(valores) as PlanKey[]).map((plan) => ({
    key: CLAVES_ARS[plan],
    value: String(valores[plan]),
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  }));
  const { error } = await supabase.from("site_settings").upsert(filas, { onConflict: "key" });
  if (error) {
    redirect("/admin/suscripciones?error=" + encodeURIComponent("No se pudieron guardar los precios: " + error.message));
  }

  revalidatePath("/membresia");
  revalidatePath("/admin/suscripciones");
  redirect("/admin/suscripciones?ok=" + encodeURIComponent("Precios en pesos guardados. Mercado Pago ya cobra estos montos."));
}
