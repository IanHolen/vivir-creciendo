import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para el navegador.
 *
 * Existe por un motivo concreto: la subida de archivos de la biblioteca de
 * multimedia va DIRECTO del navegador al Storage, con una URL firmada que
 * emite el servidor. Mandar el archivo por una server action lo obligaría a
 * pasar entero por la función de Next —que tiene un tope de 1 MB por defecto y
 * de 100 MB como máximo— y un video de testimonio no entra ahí.
 *
 * Usa la misma clave pública que el resto del sitio: la escritura al bucket la
 * autoriza la RLS (admin) y la URL firmada, no esta clave.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
