'use client';

import { motion } from 'framer-motion';
import { KeyRound, Filter, Coins } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: KeyRound,
    title: 'Join for $10/month',
    desc: 'Instant access to all 500+ deals, credits, and resources. Cancel anytime.',
  },
  {
    num: '02',
    icon: Filter,
    title: 'Browse & Filter',
    desc: 'Find deals by category, tool, or value. Smart search helps you save time.',
  },
  {
    num: '03',
    icon: Coins,
    title: 'Claim & Save',
    desc: 'Follow our step-by-step guides and unlock every dollar of savings.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 bg-[#0F172A] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Three steps. Unlimited savings.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            No paperwork, no hoops, no sales calls. Just deals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-14 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm"
            >
              <div className="relative mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center mb-5">
                <step.icon className="w-6 h-6 text-blue-300" />
                <span className="absolute -top-2 -right-2 text-[10px] font-bold text-orange-300 bg-[#0F172A] border border-orange-500/30 px-1.5 py-0.5 rounded">
                  {step.num}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
