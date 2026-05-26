"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/content";

export default function FAQ() {
  return (
    <section className="bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-black text-vc-blue-dark text-center uppercase tracking-tight">
          PREGUNTAS FRECUENTES
        </h2>
        <div className="mt-12 md:mt-16">
          <Accordion className="space-y-4">
            {faqs.map((faq, i) => (
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
  );
}
