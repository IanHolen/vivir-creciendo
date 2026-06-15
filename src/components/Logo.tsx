import Image from "next/image";

interface LogoProps {
  variant?: "color" | "white";
  className?: string;
}

// Official "Vivir Creciendo" logo (asset shared by Ian). Two variants derived
// from public/images/logo-official.png:
//  - color: brand orange sun + blue wordmark (light backgrounds)
//  - white: brand orange sun + white wordmark (dark backgrounds, e.g. footer)
// Both are trimmed to the content bounding box (1080x570, ~1.89:1).
export default function Logo({ variant = "color", className = "" }: LogoProps) {
  const src = variant === "white" ? "/images/logo-white.png" : "/images/logo-color.png";
  return (
    <Image
      src={src}
      alt="Vivir Creciendo — Comunidad +60"
      width={1080}
      height={570}
      className={className}
      priority
    />
  );
}
