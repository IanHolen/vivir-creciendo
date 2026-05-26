"use client";

import { useState, useEffect } from "react";

export default function TextSizeToggle() {
  const [enlarged, setEnlarged] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vc-text-enlarged");
    if (saved === "true") {
      setEnlarged(true);
      document.documentElement.style.fontSize = "120%";
    }
  }, []);

  const toggle = () => {
    const next = !enlarged;
    setEnlarged(next);
    document.documentElement.style.fontSize = next ? "120%" : "";
    localStorage.setItem("vc-text-enlarged", String(next));
  };

  return (
    <button
      onClick={toggle}
      className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg border border-vc-blue/20 text-vc-blue-dark hover:bg-vc-cream transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
      aria-label={enlarged ? "Reducir tamaño de texto" : "Aumentar tamaño de texto"}
      type="button"
    >
      <span className="text-base font-semibold" aria-hidden="true">
        {enlarged ? "A-" : "A+"}
      </span>
    </button>
  );
}
