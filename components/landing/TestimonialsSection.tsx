'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'Saved $3k on AWS in week one. The ROI is insane for $10/month.',
    name: 'Rahul K.',
    role: 'SaaS Founder',
    initial: 'R',
  },
  {
    quote: "Finally a platform that has everything — not just AI credits. Cloud, grants, design tools, it's all here.",
    name: 'Priya S.',
    role: 'Indie Hacker',
    initial: 'P',
  },
  {
    quote: "The grant database alone is worth it. Found $15k I didn't know existed.",
    name: 'Aman T.',
    role: 'Early Stage Founder',
    initial: 'A',
  },
  {
    quote: 'Cheapest subscription I pay. Highest ROI. Full stop.',
    name: 'Sam W.',
    role: 'Bootstrapped Startup',
    initial: 'S',
  },
];

const trustLogos = ['Y Combinator', 'Antler', 'Techstars', 'Entrepreneur First', 'On Deck', '500 Global'];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-[#0F172A] border-t border-white/5 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 30%, rgba(59,130,246,0.15), transparent 45%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-4">
            Founders Love It
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Built by founders,
            <br />
            for founders.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-blue-400/20" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <p className="text-slate-200 leading-relaxed mb-6 text-sm">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-6">
            Trusted by founders from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 opacity-70">
            {trustLogos.map((logo) => (
              <span key={logo} className="text-slate-300 text-base font-semibold tracking-tight">
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
