import Image from "next/image";

interface LogoProps {
  variant?: "color" | "white";
  className?: string;
}

// Logo oficial de Vivir Creciendo. Dos variantes:
//  - color: sol naranja + palabra en azul (fondos claros)
//  - white: sol naranja + palabra en blanco (fondos oscuros: nav y footer)
//
// Los dos PNG traían "COMUNIDAD +60" dibujado debajo de la palabra. Era el
// único "+60" que quedaba en todo el sitio —el resto de la página dice +65— y
// aparecía en el nav y el footer de todas las páginas. Como el texto está
// trazado dentro de la imagen (el .ai también viene vectorizado), no se puede
// editar el número: se recortó esa línea. El lockup quedó en sol + palabra,
// 1080x461, con el mismo aire arriba y abajo (28px).
//
// La bajada "+65" no se repone como texto acá a propósito: a la altura del nav
// (48px) quedaría en ~5px, ilegible. La audiencia ya está declarada en el
// <title>, el hero y el cuerpo de la página. Si las fundadoras quieren la
// bajada dentro del logo, hay que regenerar el .ai con la fuente original.
export default function Logo({ variant = "color", className = "" }: LogoProps) {
  const src = variant === "white" ? "/images/logo-white.png" : "/images/logo-color.png";
  return (
    <Image
      src={src}
      alt="Vivir Creciendo"
      width={1080}
      height={461}
      className={className}
      priority
    />
  );
}
