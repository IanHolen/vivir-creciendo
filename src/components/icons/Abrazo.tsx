import type { SVGProps } from "react";

/**
 * Ícono "dos personas abrazadas" para la actividad Caminando Juntos
 * (fundadoras, 17-nov-2026). lucide no trae uno de abrazo, así que este va
 * dibujado a mano con la misma gramática (viewBox 24, trazo 2, puntas
 * redondas) para que conviva con los demás sin desentonar. Acepta las mismas
 * props que un ícono de lucide (`className`, `size`, `strokeWidth`…).
 */
export default function Abrazo({
  size = 24,
  strokeWidth = 2,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="8" cy="6" r="2.5" />
      <circle cx="16" cy="6" r="2.5" />
      <path d="M3 21v-5a4 4 0 0 1 4-4h2" />
      <path d="M21 21v-5a4 4 0 0 0-4-4h-2" />
      <path d="M9 12c2.5 0 4.5 2 6.5 4.5" />
      <path d="M15 12c-2.5 0-4.5 2-6.5 4.5" />
      <path d="M7.5 21v-3" />
      <path d="M16.5 21v-3" />
    </svg>
  );
}
