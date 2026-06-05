"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, NAME_COOKIE } from "./session";

/**
 * Acciones de sesión para la landing.
 *
 * STUB (contrato aprobado con back): todavía NO hay auth real. Marcamos la
 * sesión con la cookie `vc_session`; back reemplaza el cuerpo de estas
 * acciones por Supabase Auth (signInWithPassword / signOut) sin cambiar la
 * firma pública ni cómo lo leen las secciones (getIsLoggedIn / getSessionUser).
 */
const COOKIE_OPTS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
};

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  // STUB: aceptamos cualquier credencial y abrimos sesión. Back validará real.
  const name = email.includes("@") ? email.split("@")[0] : email;

  const store = await cookies();
  store.set(SESSION_COOKIE, "1", COOKIE_OPTS);
  if (name) store.set(NAME_COOKIE, name, COOKIE_OPTS);

  // Vuelve a la MISMA landing (no una página distinta).
  redirect("/");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(NAME_COOKIE);
  redirect("/");
}
