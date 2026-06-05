import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import QuienesSomos from "@/components/sections/QuienesSomos";
import Nosotros from "@/components/sections/Nosotros";
import FreeActivities from "@/components/sections/FreeActivities";
import Memberships from "@/components/sections/Memberships";
import Newsletter from "@/components/sections/Newsletter";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getIsLoggedIn } from "@/lib/session";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string }>;
}) {
  const sp = await searchParams;
  const isLoggedIn = await getIsLoggedIn(sp);

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Landing v2 — single-page scroll con anclas.
            Mismo layout, render condicional por sesión:
            deslogueado = teaser de venta; logueado = contenido completo. */}
        <Hero />
        {/* 1 — Quiénes somos */}
        <QuienesSomos />
        {/* 2 — Nosotros (Ale + Nurit) */}
        <Nosotros />
        {/* 3 — Actividades (chill, no comercial) */}
        <FreeActivities isLoggedIn={isLoggedIn} />
        {/* 4 — Membresías */}
        <Memberships isLoggedIn={isLoggedIn} />
        {/* Cierre — contacto / newsletter */}
        <Newsletter />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
