"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, faqsTitle } from "@/lib/content";

// Sección 10 — FAQ. Acordeón sobre fondo blanco: cada pregunta desactiva una
// objeción concreta del target antes de que se convierta en un abandono.
export default function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 md:scroll-mt-24 bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-black text-vc-blue text-center uppercase tracking-tight">
          {faqsTitle}
        </h2>
        <div className="mt-12 md:mt-16">
          <Accordion className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                className="border border-vc-cream bg-vc-cream/60 rounded-xl px-6"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-vc-blue-dark py-5 hover:no-underline min-h-[56px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-vc-ink/80 text-lg leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
