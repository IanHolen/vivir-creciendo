"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Mientras el pago está "pendiente", vuelve a pedir la página cada 5 s hasta
 * 12 veces (un minuto). Cada pedido vuelve a consultar al proveedor desde el
 * servidor; cuando pasa a activa, el servidor ya pinta la otra pantalla.
 */
export default function AutoRefresh() {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      if (n > 12) return window.clearInterval(id);
      router.refresh();
    }, 5000);
    return () => window.clearInterval(id);
  }, [router]);
  return null;
}
