'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cloud, Bot, Briefcase, Rocket, Coins, Wrench, ChartBar as BarChart3, Megaphone, Palette, Scale, GraduationCap, Users, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Cloud Credits', desc: 'AWS, GCP, Azure', icon: Cloud, gradient: 'from-sky-500/20 to-blue-500/20', iconColor: 'text-sky-400', slug: 'cloud' },
  { name: 'AI Tools & Credits', desc: 'OpenAI, Anthropic, Gemini', icon: Bot, gradient: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-400', slug: 'ai' },
  { name: 'SaaS Discounts', desc: 'Notion, Linear, HubSpot', icon: Briefcase, gradient: 'from-orange-500/20 to-amber-500/20', iconColor: 'text-orange-400', slug: 'saas' },
  { name: 'Accelerators', desc: 'YC, Techstars, Antler', icon: Rocket, gradient: 'from-pink-500/20 to-rose-500/20', iconColor: 'text-pink-400', slug: 'accelerators' },
  { name: 'Grants & Funding', desc: 'Non-dilutive capital', icon: Coins, gradient: 'from-emerald-500/20 to-green-500/20', iconColor: 'text-emerald-400', slug: 'grants' },
  { name: 'Dev Tools', desc: 'GitHub, Vercel, Supabase', icon: Wrench, gradient: 'from-cyan-500/20 to-teal-500/20', iconColor: 'text-cyan-400', slug: 'dev-tools' },
  { name: 'Analytics', desc: 'Mixpanel, Amplitude, PostHog', icon: BarChart3, gradient: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400', slug: 'analytics' },
  { name: 'Marketing & SEO', desc: 'Ahrefs, Semrush, Mailchimp', icon: Megaphone, gradient: 'from-orange-500/20 to-red-500/20', iconColor: 'text-orange-400', slug: 'marketing' },
  { name: 'Design', desc: 'Figma, Framer, Canva', icon: Palette, gradient: 'from-fuchsia-500/20 to-pink-500/20', iconColor: 'text-fuchsia-400', slug: 'design' },
  { name: 'Legal & Finance', desc: 'Clerky, Mercury, Stripe Atlas', icon: Scale, gradient: 'from-slate-400/20 to-slate-500/20', iconColor: 'text-slate-300', slug: 'legal-finance' },
  { name: 'Learning & Resources', desc: 'Courses, playbooks, templates', icon: GraduationCap, gradient: 'from-yellow-500/20 to-amber-500/20', iconColor: 'text-yellow-400', slug: 'learning' },
  { name: 'Freelancer Tools', desc: 'For solo operators & indie hackers', icon: Users, gradient: 'from-teal-500/20 to-emerald-500/20', iconColor: 'text-teal-400', slug: 'freelancer' },
];

export function CategoriesSection() {
  return (
    <section id="categories" className="relative py-24 bg-[#0F172A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-4">
            12 Categories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Every tool a founder needs.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
              Every stage. Every budget.
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From day-zero prototypes to Series A scale — we cover it all.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link
                href={`/perks?category=${cat.slug}`}
                className="group relative block rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all overflow-hidden h-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className={`w-5 h-5 ${cat.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{cat.desc}</p>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse deals <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
