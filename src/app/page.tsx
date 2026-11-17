import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import ElProblema from "@/components/sections/ElProblema";
import Beneficios from "@/components/sections/Beneficios";
import EstarAdentro from "@/components/sections/EstarAdentro";
import Nosotros from "@/components/sections/Nosotros";
import Testimonials from "@/components/sections/Testimonials";
import Actividades from "@/components/sections/Actividades";
import Memberships from "@/components/sections/Memberships";
import Garantia from "@/components/sections/Garantia";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Revelar from "@/components/Revelar";
import { getSessionUser } from "@/lib/session";

/**
 * Landing v4 — el orden del documento de las fundadoras (nov-2026): primero se
 * conecta emocionalmente, después se explica, y por último se pide la acción.
 *
 *    1  Hero                 titular emocional + el único botón de acción
 *    2  El problema          nombrar lo que la persona siente (NUEVA)
 *    3  Qué vas a ganar acá  6 beneficios: transformaciones, no actividades
 *    4  Cómo es estar adentro que el visitante se imagine adentro (NUEVA)
 *    5  Nosotras + video     las bios, seguidas del video
 *    6  Voces                testimonios
 *    7  Actividades
 *    8  Membresía y precios  recién acá se muestran los precios
 *    9  La garantía          30 días de prueba (NUEVA)
 *   10  Preguntas frecuentes
 *   11  CTA final            reforzado con la garantía
 *
 * El strip de prueba social se mantiene pegado al hero: no es un botón ni
 * compite con el CTA. "El Momento" y "¿Cómo empezar?" salieron de la portada
 * (su trabajo lo hacen "El problema" y la garantía); los componentes quedan en
 * el repo por si se quieren recuperar.
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
        {/* 01b */} <SocialProof />
        {/* 02 */} <ElProblema />
        {/* 03 */} <Beneficios />
        {/* 04 */} <EstarAdentro />
        {/* 05 */} <Nosotros />
        {/* 06 */} <Testimonials />
        {/* 07 */} <Actividades />
        {/* 08 */} <Memberships />
        {/* 09 */} <Garantia />
        {/* 10 */} <FAQ />
        {/* 11 */} <FinalCTA />
      </main>
      {/* 12 */}
      <Footer />
      <WhatsAppFloat />
      <Revelar />
    </>
  );
}
