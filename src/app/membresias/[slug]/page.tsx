import { notFound } from "next/navigation";
import { Film, MessageCircle, Sparkles, Check, ArrowLeft, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { memberships } from "@/lib/content";

const iconMap = { Film, MessageCircle, Sparkles } as const;

export function generateStaticParams() {
  return memberships.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15+ async params — but generateMetadata can return sync for static
  return {};
}

export default async function MembershipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const membership = memberships.find((m) => m.slug === slug);

  if (!membership) return notFound();

  const Icon = iconMap[membership.icon];

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero */}
        <section className={`${membership.accentBg} py-20 md:py-28 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-4xl mx-auto text-center text-white">
            <a
              href="/#membresias"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-lg focus-visible:ring-4 focus-visible:ring-white/50 rounded-lg px-2 py-1"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Volver a membresías
            </a>
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-white/20 mb-6">
              <Icon className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">
              {membership.title}
            </h1>
            <p className="mt-4 font-[var(--font-subtitle)] text-xl md:text-2xl italic opacity-90">
              {membership.tagline}
            </p>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-vc-blue-dark/80 leading-relaxed">
              {membership.longDescription}
            </p>
          </div>
        </section>

        {/* What's included */}
        <section className="bg-vc-cream py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
              QUÉ INCLUYE
            </h2>
            <ul className="mt-8 space-y-4">
              {membership.includes.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-vc-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-lg text-vc-blue-dark/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Facilitator */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
              QUIÉN TE ACOMPAÑA
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-vc-cream flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-vc-blue/40" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-vc-blue-dark">
                  {membership.facilitator}
                </h3>
                <p className="mt-2 text-lg text-vc-blue-dark/70 leading-relaxed">
                  {membership.facilitatorBio}
                </p>
                <blockquote className="mt-4 italic text-vc-blue-dark/60 text-lg">
                  &ldquo;{membership.closingQuote}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Price + CTA */}
        <section className="bg-vc-cream py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-vc-blue-dark/50 text-lg mb-4">{membership.price}</p>
            <a
              href="/#contacto"
              className="inline-flex items-center justify-center min-h-[56px] px-10 py-4 bg-vc-orange hover:bg-vc-orange-light text-white font-semibold text-lg rounded-xl transition-colors focus-visible:ring-4 focus-visible:ring-vc-orange shadow-lg"
            >
              SUSCRIBIRME
            </a>
            <p className="mt-4 text-sm text-vc-blue-dark/50">
              Suscripción mensual. Cancela cuando quieras, sin permanencia mínima.
            </p>
          </div>
        </section>

        {/* FAQ */}
        {membership.faqs.length > 0 && (
          <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight text-center">
                PREGUNTAS FRECUENTES
              </h2>
              <div className="mt-10">
                <Accordion className="space-y-4">
                  {membership.faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      className="border border-gray-200 rounded-xl px-6"
                    >
                      <AccordionTrigger className="text-left text-lg font-semibold text-vc-blue-dark py-5 hover:no-underline min-h-[56px]">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-vc-blue-dark/70 text-lg leading-relaxed pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        )}

        {/* Back link */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
          <a
            href="/#membresias"
            className="inline-flex items-center gap-2 text-vc-blue hover:text-vc-orange transition-colors text-lg font-medium focus-visible:ring-4 focus-visible:ring-vc-orange rounded-lg px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Ver todas las membresías
          </a>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
