import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback de enlaces de correo (confirmación de cuenta y recuperar contraseña).
 * Supabase manda al usuario aquí con ?code=...; lo canjeamos por sesión y
 * redirigimos a ?next (ej. / o /recuperar/nueva).
 * Back debe allowlistear esta URL en Auth > URL Configuration.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=` +
      encodeURIComponent("El enlace no es válido o expiró. Pide uno nuevo.")
  );
}
