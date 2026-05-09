'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What do I get with a membership?',
    a: 'Instant access to 500+ curated startup and AI deals worth $2M+ — credits, lifetime discounts, free plans, accelerator intros, grants and members-only offers. New perks are added every single week.',
  },
  {
    q: "What's the difference between Pro and Lifetime?",
    a: "Pro is $99/year and includes everything — full catalog access, guides, community and priority support. Lifetime is a single $299 payment that locks in access forever, including every future perk we add. Lifetime pays for itself in under 3 years.",
  },
  {
    q: 'How are you different from GetAIPerks or FoundersPrime?',
    a: 'We cover six modules (cloud, AI, SaaS, accelerators, grants, dev tools) instead of just AI (GetAIPerks) or a terminal-style dashboard (FoundersPrime). We also offer step-by-step redemption guides, global + India coverage, and a 30-day money-back guarantee neither competitor offers.',
  },
  {
    q: 'Are the perks real and verified?',
    a: 'Yes. Every deal is hand-verified by our team and linked directly to the provider. If anything is ever inaccurate, we fix it fast and credit your membership.',
  },
  {
    q: 'Do you offer a refund?',
    a: "Yes. We offer a 30-day money-back guarantee on both Pro and Lifetime plans — no questions asked.",
  },
  {
    q: 'Do I need to be an incorporated startup?',
    a: "No. Our perks are available to solo founders, indie hackers, and teams of any size. Some provider-side perks may still require a business email — we flag those clearly.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-[#0A0F1E]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em]">FAQ</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-3 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-slate-400">
            Still have questions? Email us at support@founderstackhub.com
          </p>
        </div>

        <Accordion type="single" collapsible className="bg-white/[0.03] border border-white/10 rounded-2xl px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
              <AccordionTrigger className="text-left text-white font-medium hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
