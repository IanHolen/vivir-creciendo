"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/content";

export default function WhatsAppFloat() {
  const whatsappNumber = siteConfig.whatsapp.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors animate-pulse focus-visible:ring-4 focus-visible:ring-vc-orange focus-visible:animate-none"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8" aria-hidden="true" />
    </a>
  );
}
