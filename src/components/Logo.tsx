interface LogoProps {
  variant?: "color" | "white";
  className?: string;
}

export default function Logo({ variant = "color", className = "" }: LogoProps) {
  const sunColor = variant === "white" ? "#FFFFFF" : "#EB5600";
  const textColor = variant === "white" ? "#FFFFFF" : "#274EA4";

  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vivir Creciendo — Comunidad +60"
      role="img"
    >
      {/* Sun rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 15) - 82.5;
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + Math.cos(rad) * 12;
        const y1 = 22 - Math.sin(rad) * 12;
        const x2 = 100 + Math.cos(rad) * 22;
        const y2 = 22 - Math.sin(rad) * 22;
        const nextAngle = ((i + 1) * 15) - 82.5;
        const nextRad = (nextAngle * Math.PI) / 180;
        const x3 = 100 + Math.cos(nextRad) * 22;
        const y3 = 22 - Math.sin(nextRad) * 22;
        const x4 = 100 + Math.cos(nextRad) * 12;
        const y4 = 22 - Math.sin(nextRad) * 12;
        return (
          <polygon
            key={i}
            points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
            fill={sunColor}
          />
        );
      })}
      {/* Semicircle base */}
      <path
        d={`M 78 22 A 22 22 0 0 1 122 22 L 78 22 Z`}
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
        fontFamily="'Archivo Black', sans-serif"
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
        fontFamily="'Work Sans', sans-serif"
        fontWeight="500"
        letterSpacing="1.5"
      >
        COMUNIDAD +60
      </text>
    </svg>
  );
}
