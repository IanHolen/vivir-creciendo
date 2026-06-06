import type { Metadata } from "next";
import Philosophy from "@/components/sections/Philosophy";
import Team from "@/components/sections/Team";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "Nosotros — Vivir Creciendo",
  description:
    "Conoce nuestra filosofía, el equipo que acompaña a la comunidad y lo que dicen quienes ya viven creciendo con nosotros.",
};

export default function NosotrosPage() {
  return (
    <main id="main-content">
      <Philosophy />
      <Team />
      <Testimonials />
      <FAQ />
    </main>
  );
}
