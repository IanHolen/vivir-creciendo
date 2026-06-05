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

/**
 * Registro de nueva cuenta (contrato back 64a815fb): Edge Function 'signup'
 * crea el usuario YA CONFIRMADO (auto-confirm, sin email — no hay SMTP propio).
 * Luego lo logueamos directo y va a la landing.
 */
export async function signup(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    redirect(
      "/registro?error=" +
        encodeURIComponent("La contraseña debe tener al menos 8 caracteres.")
    );
  }

  const supabase = await createClient();
  // back captura el nombre desde el body (raw_user_meta_data → profiles.full_name).
  const { data, error } = await supabase.functions.invoke("signup", {
    body: { email, password, name },
  });

  if (error || !data?.ok) {
    redirect(
      "/registro?error=" +
        encodeURIComponent(friendlySignupError(await edgeErrorCode(error, data)))
    );
  }

  // Auto-confirmado → login inmediato para abrir sesión.
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    // La cuenta se creó; mandamos a login con aviso.
    redirect("/login?error=" + encodeURIComponent("Cuenta creada. Inicia sesión."));
  }

  redirect("/");
}

/** Extrae el código de error del cuerpo de una Edge Function (non-2xx) o del data. */
async function edgeErrorCode(
  error: unknown,
  data: { error?: string } | null
): Promise<string> {
  if (data?.error) return data.error;
  const ctx = (error as { context?: { json?: () => Promise<unknown> } })?.context;
  if (ctx?.json) {
    try {
      const body = (await ctx.json()) as { error?: string };
      if (body?.error) return body.error;
    } catch {
      // ignore
    }
  }
  return (error as { message?: string })?.message ?? "";
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

function friendlySignupError(code: string): string {
  const m = code.toLowerCase();
  if (m.includes("user_already_exists") || m.includes("already"))
    return "Ya existe una cuenta con ese correo. Inicia sesión.";
  if (m.includes("weak_password") || m.includes("password"))
    return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("invalid_email") || (m.includes("invalid") && m.includes("email")))
    return "El correo no es válido. Revísalo e intenta de nuevo.";
  if (m.includes("email_and_password_required"))
    return "Faltan datos. Completa correo y contraseña.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiados intentos. Prueba de nuevo en unos minutos.";
  return "No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.";
}
