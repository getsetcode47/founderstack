'use client';

import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';

const rows = [
  { platform: 'Founder Stack Hub', price: '$10/mo or $50/yr', deals: '500+', highlight: true },
  { platform: 'FounderPass', price: '$99/year', deals: '350+', highlight: false },
  { platform: 'Freelance Stack', price: '~$60/year', deals: '850+', highlight: false },
  { platform: 'GetAIPerks', price: '$149/year', deals: '220+ (AI only)', highlight: false },
  { platform: 'FoundersPrime', price: 'Paid tiers', deals: '200+', highlight: false },
];

export function ComparisonSection() {
  return (
    <section className="relative py-24 bg-[#0F172A] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(249,115,22,0.18), transparent 50%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-4">
            <Crown className="w-3.5 h-3.5" />
            The Price Advantage
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            The most affordable founder hub
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
              in the market.
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Same credits. Same deals. A fraction of the price.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-sm"
        >
          <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-slate-400">
            <div className="col-span-5">Platform</div>
            <div className="col-span-4">Price</div>
            <div className="col-span-3 text-right sm:text-left">Deals</div>
          </div>
          {rows.map((row, i) => (
            <motion.div
              key={row.platform}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className={`grid grid-cols-12 items-center px-6 py-5 border-b border-white/5 last:border-0 ${
                row.highlight ? 'bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent' : ''
              }`}
            >
              <div className="col-span-5 flex items-center gap-2">
                {row.highlight && (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
                <span className={`font-semibold ${row.highlight ? 'text-white' : 'text-slate-300'}`}>
                  {row.platform}
                </span>
                {row.highlight && (
                  <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-orange-300 bg-orange-500/20 border border-orange-500/30 px-2 py-0.5 rounded">
                    Best Value
                  </span>
                )}
              </div>
              <div className={`col-span-4 font-mono text-sm ${row.highlight ? 'text-orange-300 font-bold' : 'text-slate-400'}`}>
                {row.price}
              </div>
              <div className={`col-span-3 text-right sm:text-left text-sm ${row.highlight ? 'text-white font-semibold' : 'text-slate-400'}`}>
                {row.deals}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-sm text-slate-500 mt-6"
        >
          Pricing reflects public plans as of launch. Comparable categories and verified deals.
        </motion.p>
      </div>
    </section>
  );
}
