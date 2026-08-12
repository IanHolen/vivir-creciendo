import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos que se cargan desde /admin/multimedia viven en el Storage de
    // Supabase, no en /public. Sin declarar el host, next/image las rechaza.
    // Se acota a la ruta pública del Storage: el resto de la API de Supabase
    // no tiene por qué pasar por el optimizador de imágenes.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
