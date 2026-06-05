import Image from "next/image";

interface LogoProps {
  variant?: "color" | "white";
  className?: string;
}

export default function Logo({ variant = "color", className = "" }: LogoProps) {
  if (variant === "white") {
    return (
      <Image
        src="/images/logo-white.png"
        alt="Vivir Creciendo — Comunidad +60"
        width={160}
        height={60}
        className={className}
        priority
      />
    );
  }

  // Color variant — SVG matching brand guide
  return (
    <svg
      viewBox="0 0 240 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vivir Creciendo — Comunidad +60"
      role="img"
    >
      {/* Sun: semicircle + rays */}
      <g transform="translate(120, 28)">
        {/* Semicircle base */}
        <path d="M -20 0 A 20 20 0 0 1 20 0 Z" fill="#EB5600" />
        {/* 12 triangular rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = 15 + i * (150 / 11); // spread from 15° to 165°
          const rad = (angle * Math.PI) / 180;
          const halfW = 5; // degrees of ray width
          const r1 = 22;
          const r2 = 38;
          const leftRad = ((angle - halfW) * Math.PI) / 180;
          const rightRad = ((angle + halfW) * Math.PI) / 180;
          // Round to fixed precision so SSR (Node) and client (browser) serialize
          // identically — avoids a React hydration mismatch on the trig output.
          const p = (n: number) => n.toFixed(3);
          return (
            <polygon
              key={i}
              points={[
                `${p(-Math.cos(leftRad) * r1)},${p(-Math.sin(leftRad) * r1)}`,
                `${p(-Math.cos(rad) * r2)},${p(-Math.sin(rad) * r2)}`,
                `${p(-Math.cos(rightRad) * r1)},${p(-Math.sin(rightRad) * r1)}`,
              ].join(" ")}
              fill="#EB5600"
            />
          );
        })}
      </g>
      {/* Wordmark */}
      <text
        x="120"
        y="58"
        textAnchor="middle"
        fill="#274EA4"
        fontSize="20"
        fontWeight="900"
        fontFamily="'Archivo Black', 'Arial Black', sans-serif"
        letterSpacing="3"
      >
        VIVIR CRECIENDO
      </text>
      {/* Subtitle */}
      <text
        x="120"
        y="74"
        textAnchor="middle"
        fill="#274EA4"
        fontSize="10"
        fontFamily="'Work Sans', 'Arial', sans-serif"
        fontWeight="500"
        letterSpacing="2"
      >
        COMUNIDAD +60
      </text>
    </svg>
  );
}
