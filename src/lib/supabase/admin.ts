import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la clave secreta (service role).
 *
 * SOLO para los webhooks de pagos y las server actions de suscripción: ahí
 * no hay sesión de usuario (o hay que escribir en tablas que ningún usuario
 * puede escribir por RLS). Este archivo lleva `server-only` para que el
 * bundler rompa la compilación si alguien lo importa desde un componente de
 * cliente, en vez de mandar la clave al navegador en silencio.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("Falta SUPABASE_SECRET_KEY en el entorno.");
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
