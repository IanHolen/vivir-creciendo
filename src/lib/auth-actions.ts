"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
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

/** Registro de nueva cuenta. */
export async function signup(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    redirect(
      "/registro?error=" +
        encodeURIComponent("La contraseña debe tener al menos 6 caracteres.")
    );
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${origin}/auth/callback?next=/`,
    },
  });

  if (error) {
    redirect("/registro?error=" + encodeURIComponent(friendlySignupError(error.message)));
  }

  // Email confirmation ON → no hay sesión todavía: avisar que revise el correo.
  if (!data.session) {
    redirect("/registro?enviado=1");
  }
  // Auto-confirm ON → ya quedó logueado.
  redirect("/");
}

/** Paso 1 de recuperar: enviar el correo con el enlace. */
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/recuperar/nueva`,
  });

  // Siempre mostramos éxito (no revelar qué correos existen).
  redirect("/recuperar?enviado=1");
}

/** Paso 2 de recuperar: fijar la nueva contraseña (con sesión de recovery activa). */
export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) {
    redirect(
      "/recuperar/nueva?error=" +
        encodeURIComponent("La contraseña debe tener al menos 6 caracteres.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(
      "/recuperar/nueva?error=" +
        encodeURIComponent(
          "No se pudo actualizar la contraseña. El enlace pudo expirar; pide uno nuevo."
        )
    );
  }
  redirect("/?password=actualizada");
}

function friendlySignupError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con ese correo. Inicia sesión.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiados intentos. Prueba de nuevo en unos minutos.";
  if (m.includes("password"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("invalid") && m.includes("email"))
    return "El correo no es válido. Revísalo e intenta de nuevo.";
  return "No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.";
}
