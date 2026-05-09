'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('giveaway_leads')
      .insert({ email: email.trim().toLowerCase() });

    if (error && !error.message.toLowerCase().includes('duplicate')) {
      toast.error('Something went wrong. Please try again.');
    } else {
      setSubmitted(true);
      setEmail('');
    }
    setLoading(false);
  }

  return (
    <section className="py-24 bg-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/10 via-slate-900/40 to-blue-500/10 p-10 sm:p-16 overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-6">
              <Mail className="w-3.5 h-3.5" />
              Early access list
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Get deals before anyone else.
            </h2>
            <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
              We&apos;re launching this week. Join the list to unlock member-only perks
              and be first in line when new deals drop.
            </p>

            {submitted ? (
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
                You&apos;re on the list — we&apos;ll be in touch.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/40"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2 shadow-lg shadow-orange-500/30"
                >
                  {loading ? 'Joining...' : 'Get Early Access'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            )}
            <p className="text-xs text-slate-500 mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
