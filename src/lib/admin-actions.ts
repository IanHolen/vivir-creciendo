"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Mutaciones del panel admin sobre public.activities (contrato back f661857c).
 * La RLS exige is_admin; estas acciones corren con la sesión del usuario, así
 * que un no-admin recibe error de RLS aunque llegue a llamarlas.
 */

function parseFields(formData: FormData) {
  const week = formData.get("week");
  const sortOrder = formData.get("sort_order");
  return {
    title: String(formData.get("title") ?? "").trim(),
    short_preview: String(formData.get("short_preview") ?? "").trim(),
    full_description: String(formData.get("full_description") ?? "").trim(),
    week: week === null || week === "" ? null : Number(week),
    sort_order: sortOrder === null || sortOrder === "" ? null : Number(sortOrder),
    is_active: formData.get("is_active") === "on",
  };
}

function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createActivity(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("activities").insert(parseFields(formData));
  if (error) {
    return redirectError(error.message);
  }
  revalidate();
}

export async function updateActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("activities")
    .update(parseFields(formData))
    .eq("id", id);
  if (error) {
    return redirectError(error.message);
  }
  revalidate();
}

export async function deleteActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) {
    return redirectError(error.message);
  }
  revalidate();
}

function redirectError(msg: string): never {
  redirect("/admin?error=" + encodeURIComponent(msg));
}
