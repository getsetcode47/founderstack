'use client';

import { motion } from 'framer-motion';
import { DollarSign, Layers, FolderTree, CalendarClock, Rocket } from 'lucide-react';

const stats = [
  { icon: Layers, value: '500+', label: 'Curated deals', color: 'blue' },
  { icon: DollarSign, value: '$2M+', label: 'In savings unlocked', color: 'orange' },
  { icon: FolderTree, value: '50+', label: 'Categories covered', color: 'blue' },
  { icon: CalendarClock, value: 'Weekly', label: 'Fresh perks added', color: 'blue' },
  { icon: Rocket, value: 'This Week', label: 'Launching now', color: 'orange' },
] as const;

export function StatsSection() {
  return (
    <section className="relative py-16 bg-[#0F172A] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  stat.color === 'orange'
                    ? 'bg-orange-500/10 border border-orange-500/20'
                    : 'bg-blue-500/10 border border-blue-500/20'
                }`}>
                  <stat.icon className={`w-5 h-5 ${stat.color === 'orange' ? 'text-orange-400' : 'text-blue-400'}`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
