import { BookOpen, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/content";

export default function Blog() {
  return (
    <section className="bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark uppercase tracking-tight">
            BLOG
          </h2>
          <p className="mt-4 text-xl text-vc-blue-dark/70">
            Reflexiones, aprendizajes y experiencias de nuestra comunidad
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <a
              key={post.title}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-vc-cream/40 rounded-2xl p-8 border border-vc-cream hover:shadow-lg transition-shadow focus-visible:ring-4 focus-visible:ring-vc-orange"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-vc-blue/10 group-hover:bg-vc-blue/20 transition-colors">
                <BookOpen className="w-6 h-6 text-vc-blue" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-semibold text-xl text-vc-blue-dark leading-snug">
                {post.title}
              </h3>
              <p className="mt-2 text-vc-blue-dark/70 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-vc-orange font-medium group-hover:gap-3 transition-all">
                <span>Leer más</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        {/* Blog page coming soon — button removed until we have our own blog */}
      </div>
    </section>
  );
}
