import type { Metadata } from "next";
import Blog from "@/components/sections/Blog";

export const metadata: Metadata = {
  title: "Blog — Vivir Creciendo",
  description:
    "Artículos, reflexiones y recursos de la comunidad Vivir Creciendo para seguir creciendo a cualquier edad.",
};

export default function BlogPage() {
  return (
    <main id="main-content">
      <Blog />
    </main>
  );
}
