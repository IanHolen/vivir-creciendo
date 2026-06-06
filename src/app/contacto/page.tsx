import type { Metadata } from "next";
import FinalCTA from "@/components/sections/FinalCTA";
import Newsletter from "@/components/sections/Newsletter";

export const metadata: Metadata = {
  title: "Contacto — Vivir Creciendo",
  description:
    "Ponte en contacto con Vivir Creciendo y suscríbete a nuestro boletín para no perderte ninguna actividad.",
};

export default function ContactoPage() {
  return (
    <main id="main-content">
      <FinalCTA />
      <Newsletter />
    </main>
  );
}
