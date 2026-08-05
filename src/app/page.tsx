import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import ElMomento from "@/components/sections/ElMomento";
import Pillars from "@/components/sections/Pillars";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import Actividades from "@/components/sections/Actividades";
import Nosotros from "@/components/sections/Nosotros";
import Memberships from "@/components/sections/Memberships";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getSessionUser } from "@/lib/session";

/**
 * Landing v3 — reestructurada según la Parte VI del doc de optimización.
 *
 * PRINCIPIO RECTOR: la página es una pendiente resbaladiza. Cada sección
 * tiene UN trabajo, nunca dos, y el flujo de decisión es:
 *
 *   RECONOCIMIENTO  "esto es para mí"          → Hero + Strip
 *   RESONANCIA      "me entienden"             → El Momento
 *   COMPRENSIÓN     "entiendo qué hacen"       → Qué es VC + Cómo funciona
 *   CONFIANZA       "parecen reales"           → Testimonios + Actividades + Nosotras
 *   EVALUACIÓN      "puedo permitírmelo"       → Membresías (con precios)
 *   OBJECIÓN        "no me van a presionar"    → FAQ
 *   ACCIÓN          "me apunto"                → CTA final
 *
 * Todos los CTA de la página apuntan al mismo destino (#contacto) con el
 * mismo texto. No hay render condicional por sesión en el cuerpo de venta:
 * los precios y el contenido se ven siempre (el estado de sesión solo cambia
 * el nav).
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string }>;
}) {
  const sp = await searchParams;
  const { isLoggedIn, name } = await getSessionUser(sp);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={name} />
      <main id="main-content">
        {/* 01 */} <Hero />
        {/* 02 */} <SocialProof />
        {/* 03 */} <ElMomento />
        {/* 04 */} <Pillars />
        {/* 05 */} <HowItWorks />
        {/* 06 */} <Testimonials />
        {/* 07 */} <Actividades />
        {/* 08 */} <Nosotros />
        {/* 09 */} <Memberships />
        {/* 10 */} <FAQ />
        {/* 11 */} <FinalCTA />
      </main>
      {/* 12 */}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
