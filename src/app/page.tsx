import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Nosotros from "@/components/sections/Nosotros";
import FreeActivities from "@/components/sections/FreeActivities";
import Memberships from "@/components/sections/Memberships";
import MembershipsIncludes from "@/components/sections/MembershipsIncludes";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
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
        {/* 4 — Membresías (precios, ancla #membresias — destino del Hero) */}
        <Memberships isLoggedIn={isLoggedIn} />
        {/* 4b — ¿Qué incluyen las Membresías? (Esencial + Plus), coexiste debajo */}
        <MembershipsIncludes />
        {/* Cierre — contacto */}
        <FinalCTA />
        {/* Banda de cierre — link secundario a la página Nosotros (Ian 2026-06-28) */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <a
              href="/nosotros"
              className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 py-4 border-2 border-vc-blue text-vc-blue-dark hover:bg-vc-blue hover:text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-blue/40"
            >
              Conoce más detalles sobre Nosotros
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
