"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Acciones de sesión (Supabase Auth email+password — contrato back f661857c).
 */

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      "/login?error=" +
        encodeURIComponent("Correo o contraseña incorrectos. Intenta de nuevo.")
    );
  }

  // Vuelve a la MISMA landing (no una página distinta).
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
