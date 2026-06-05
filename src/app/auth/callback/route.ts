import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback de enlaces de correo (confirmación de cuenta y recuperar contraseña).
 * Tolerante a AMBOS formatos de Supabase (robusto ante el template que quede):
 *   - ?code=...                  → exchangeCodeForSession (flujo PKCE, default).
 *   - ?token_hash=...&type=...   → verifyOtp.
 * Canjea por sesión y redirige a ?next. Back/Ian allowlistean esta URL en
 * Auth > URL Configuration.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/";
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(
    `${origin}/login?error=` +
      encodeURIComponent("El enlace no es válido o expiró. Pide uno nuevo.")
  );
}
