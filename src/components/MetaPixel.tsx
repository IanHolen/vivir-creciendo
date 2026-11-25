"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, metaTrack } from "@/lib/meta-pixel";

/**
 * Código base del píxel de Meta, en todas las páginas (va en el layout raíz).
 *
 * - Carga el script con next/script después de que la página es interactiva
 *   y dispara el PageView inicial, como el snippet oficial.
 * - Next navega sin recargar, así que el PageView de cada página siguiente se
 *   dispara a mano al cambiar la ruta (el snippet solo lo hace al cargar).
 * - Evento Lead sin tocar cada botón: cualquier enlace o botón con
 *   `data-meta-lead="<nombre>"` lo dispara al hacer clic, y cualquier
 *   formulario con `data-meta-lead="<nombre>"` al enviarse.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const primeraRuta = useRef(true);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    // El primer PageView lo dispara el snippet; acá solo los cambios de ruta.
    if (primeraRuta.current) {
      primeraRuta.current = false;
      return;
    }
    metaTrack("PageView");
  }, [pathname]);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-meta-lead]");
      if (!el || el.tagName === "FORM") return;
      metaTrack("Lead", { content_name: el.dataset.metaLead || "clic" });
    };
    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement | null;
      if (!form || !form.dataset?.metaLead) return;
      metaTrack("Lead", { content_name: form.dataset.metaLead });
    };
    // En fase de captura: se dispara aunque el handler del elemento navegue.
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
