interface LogoProps {
  variant?: "color" | "white";
  className?: string;
}

export default function Logo({ variant = "color", className = "" }: LogoProps) {
  const sunColor = variant === "white" ? "#FFFFFF" : "#EB5600";
  const textColor = variant === "white" ? "#FFFFFF" : "#274EA4";

  // Generate 12 triangular rays emanating upward from the semicircle
  const rays = Array.from({ length: 12 }).map((_, i) => {
    const centerAngle = i * 15 - 82.5; // spread across top 180°
    const centerRad = (centerAngle * Math.PI) / 180;
    const halfWidth = 3.5; // half-angle width of ray base in degrees
    const leftRad = ((centerAngle - halfWidth) * Math.PI) / 180;
    const rightRad = ((centerAngle + halfWidth) * Math.PI) / 180;

    const r1 = 23; // inner radius (just outside semicircle r=22)
    const r2 = 40; // outer radius (ray tip)

    // Base left point
    const bx1 = 100 + Math.cos(leftRad) * r1;
    const by1 = 22 - Math.sin(leftRad) * r1;
    // Base right point
    const bx2 = 100 + Math.cos(rightRad) * r1;
    const by2 = 22 - Math.sin(rightRad) * r1;
    // Apex point
    const ax = 100 + Math.cos(centerRad) * r2;
    const ay = 22 - Math.sin(centerRad) * r2;

    return (
      <polygon
        key={i}
        points={`${bx1},${by1} ${ax},${ay} ${bx2},${by2}`}
        fill={sunColor}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vivir Creciendo — Comunidad +60"
      role="img"
    >
      {/* Triangular sun rays */}
      {rays}
      {/* Semicircle base (horizon) */}
      <path
        d="M 78 22 A 22 22 0 0 1 122 22 L 78 22 Z"
        fill={sunColor}
      />
      {/* Wordmark */}
      <text
        x="100"
        y="48"
        textAnchor="middle"
        fill={textColor}
        fontSize="16"
        fontWeight="900"
        fontFamily="'Archivo Black', 'Arial Black', sans-serif"
        letterSpacing="2"
      >
        VIVIR CRECIENDO
      </text>
      {/* Subtitle */}
      <text
        x="100"
        y="62"
        textAnchor="middle"
        fill={textColor}
        fontSize="9"
        fontFamily="'Work Sans', 'Arial', sans-serif"
        fontWeight="500"
        letterSpacing="1.5"
      >
        COMUNIDAD +60
      </text>
    </svg>
  );
}
