"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import TextSizeToggle from "./TextSizeToggle";
import { navLinks } from "@/lib/content";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <a href="#" className="flex-shrink-0 focus-visible:ring-4 focus-visible:ring-vc-orange rounded-lg">
          <Logo className="h-12 w-auto md:h-14" />
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-vc-blue-dark hover:text-vc-orange transition-colors font-medium text-base focus-visible:ring-4 focus-visible:ring-vc-orange rounded-lg px-2 py-1"
            >
              {link.label}
            </a>
          ))}
          <TextSizeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <TextSizeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg text-vc-blue-dark hover:bg-vc-cream transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            type="button"
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-16 md:top-20 bg-white z-30 flex flex-col items-center justify-center gap-8 p-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-semibold text-vc-blue-dark hover:text-vc-orange transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange rounded-lg px-4 py-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
