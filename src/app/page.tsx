import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Nosotros from "@/components/sections/Nosotros";
import FreeActivities from "@/components/sections/FreeActivities";
import Memberships from "@/components/sections/Memberships";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/Footer";
import StickyMembershipsCta from "@/components/StickyMembershipsCta";
import { getSessionUser } from "@/lib/session";
import { getActivities } from "@/lib/activities";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string }>;
}) {
  const sp = await searchParams;
  const [{ isLoggedIn, name }, activities] = await Promise.all([
    getSessionUser(sp),
    getActivities(),
  ]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={name} />
      <main id="main-content">
        {/* Landing v2 — single-page scroll con anclas.
            Mismo layout, render condicional por sesión:
            deslogueado = teaser de venta; logueado = contenido completo. */}
        {/* 1 — Hero + Quiénes somos (integrado, ancla #quienes-somos) */}
        <Hero />
        {/* 2 — Nosotros (Ale + Nurit) */}
        <Nosotros />
        {/* 3 — Actividades (chill, no comercial) */}
        <FreeActivities activities={activities} isLoggedIn={isLoggedIn} />
        {/* 4 — Membresías (precios, ancla #membresias — destino del Hero).
            Las descripciones del viejo bloque "¿Qué incluyen?" ahora viven
            dentro de cada tarjeta de precios. */}
        <Memberships isLoggedIn={isLoggedIn} />
        {/* Cierre — contacto (incluye el link secundario a /nosotros) */}
        <FinalCTA />
      </main>
      <Footer />
      <StickyMembershipsCta />
    </>
  );
}
