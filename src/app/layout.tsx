import type { Metadata } from "next";
import { Archivo_Black, Mada, Work_Sans } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mada = Mada({
  subsets: ["latin"],
  variable: "--font-subtitle",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// SEO — Parte XI del doc. El title decía "+60" mientras el hero decía "+65";
// la audiencia va unificada en +65 en toda la página.
export const metadata: Metadata = {
  title:
    "Vivir Creciendo — La comunidad online +65 en español | Crece, conecta, pertenece",
  description:
    "Comunidad online en español para personas de 65 años en adelante. Actividades semanales en vivo: cine, grupos de escucha, salud y cultura. Primera actividad gratis, sin compromiso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${archivoBlack.variable} ${mada.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-vc-orange focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-lg"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
