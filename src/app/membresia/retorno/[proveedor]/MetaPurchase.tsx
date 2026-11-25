"use client";

import { useEffect } from "react";
import { metaTrack } from "@/lib/meta-pixel";

/**
 * Evento Purchase del píxel de Meta en la página de "gracias" (equipo de
 * anuncios, nov-2026). Se pinta solo cuando el proveedor confirmó que la
 * suscripción quedó activa.
 *
 * Una sola vez por suscripción: la página se puede recargar o volver a abrir
 * desde el historial, y el ID de la suscripción queda anotado en el navegador
 * para no repetir el evento. Además va como eventID para que Meta deduplique
 * por su lado si aun así llegara dos veces.
 */
export default function MetaPurchase({
  suscripcionId,
  valor,
  moneda,
  plan,
}: {
  suscripcionId: string;
  valor: number;
  moneda: string;
  plan: string;
}) {
  useEffect(() => {
    const clave = `vc-meta-purchase:${suscripcionId}`;
    try {
      if (window.localStorage.getItem(clave)) return;
    } catch {
      /* sin almacenamiento: se dispara igual */
    }
    metaTrack(
      "Purchase",
      {
        value: valor,
        currency: moneda,
        content_name: `Membresía ${plan}`,
        content_type: "product",
        content_ids: [`membresia-${plan}`],
        num_items: 1,
      },
      `purchase-${suscripcionId}`
    );
    try {
      window.localStorage.setItem(clave, new Date().toISOString());
    } catch {
      /* ignorar */
    }
  }, [suscripcionId, valor, moneda, plan]);
  return null;
}
