'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Brain, LayoutDashboard, Code as Code2, Megaphone, Cloud, Check, Copy, CheckCheck, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const interests = [
  { id: 'a1b2c3d4-0001-0001-0001-000000000001', label: 'AI Tools', icon: Brain, color: 'blue' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000002', label: 'SaaS', icon: LayoutDashboard, color: 'green' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000003', label: 'DevTools', icon: Code2, color: 'orange' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000004', label: 'Marketing', icon: Megaphone, color: 'rose' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000005', label: 'Cloud', icon: Cloud, color: 'cyan' },
];

const colorClasses: Record<string, { selected: string; unselected: string }> = {
  blue: { selected: 'border-cyan-500 bg-cyan-500/10 text-cyan-300', unselected: 'border-gray-800 hover:border-cyan-500/40' },
  green: { selected: 'border-emerald-500 bg-emerald-500/10 text-emerald-300', unselected: 'border-gray-800 hover:border-emerald-500/40' },
  orange: { selected: 'border-orange-500 bg-orange-500/10 text-orange-300', unselected: 'border-gray-800 hover:border-orange-500/40' },
  rose: { selected: 'border-rose-500 bg-rose-500/10 text-rose-300', unselected: 'border-gray-800 hover:border-rose-500/40' },
  cyan: { selected: 'border-sky-500 bg-sky-500/10 text-sky-300', unselected: 'border-gray-800 hover:border-sky-500/40' },
};

interface OnboardingModalProps {
  userId: string;
  referralCode: string;
  onComplete: () => void;
}

export function OnboardingModal({ userId, referralCode, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  function toggleInterest(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function finish() {
    setSaving(true);
    await supabase
      .from('profiles')
      .update({ interests: selected, onboarding_completed: true })
      .eq('id', userId);
    setSaving(false);
    onComplete();
  }

  function copyCode() {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open>
      <DialogContent className="max-w-lg overflow-hidden border-gray-800 bg-[#020617] p-0 text-white [&>button]:hidden">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-1.5 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-cyan-400' : 'bg-gray-800'}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-6"
            >
              <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="mb-1 text-xl font-bold text-white">Welcome to Founder Stack!</h2>
                <p className="text-sm text-gray-400">
                  Tell us what you&apos;re building so we can recommend the best perks for your stack.
                </p>
              </div>

              <p className="mb-3 text-sm font-medium text-gray-300">What tools does your startup need?</p>
              <div className="grid grid-cols-2 gap-3">
                {interests.map((item) => {
                  const isSelected = selected.includes(item.id);
                  const colors = colorClasses[item.color];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                        isSelected ? colors.selected : `${colors.unselected} text-gray-300 bg-white/[0.02]`
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-current rounded-full flex items-center justify-center opacity-70">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => setStep(2)}
                className="mt-6 h-10 w-full gap-2 bg-white text-black hover:bg-gray-100"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-6"
            >
              <div className="mb-5">
                <h2 className="mb-1 text-xl font-bold text-white">You&apos;re all set!</h2>
                <p className="text-sm text-gray-400">
                  Based on your interests, we&apos;ve curated the best perks for your startup stack.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { icon: '✅', label: 'Browse 200+ startup perks' },
                  { icon: '🎯', label: 'Personalized recommendations ready' },
                  { icon: '📌', label: 'Bookmark and track claimed perks' },
                  { icon: '🔗', label: 'Share with other founders' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setStep(3)}
                className="h-10 w-full gap-2 bg-white text-black hover:bg-gray-100"
              >
                See my referral code
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-6"
            >
              <div className="mb-5">
                <h2 className="mb-1 text-xl font-bold text-white">Invite other founders</h2>
                <p className="text-sm text-gray-400">
                  Share your code to unlock bonus perks for you and your friends.
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-gray-800 bg-white/[0.03] p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Your referral code</p>
                <div className="flex items-center gap-3">
                  <span className="flex-1 font-mono text-2xl font-bold tracking-widest text-white">
                    {referralCode}
                  </span>
                  <Button onClick={copyCode} variant="outline" size="sm" className="h-9 gap-2 border-gray-700 bg-black text-white hover:bg-white/5">
                    {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <Button
                onClick={finish}
                disabled={saving}
                className="h-10 w-full bg-white text-black hover:bg-gray-100"
              >
                {saving ? 'Getting ready...' : 'Start exploring perks'}
              </Button>
              <button onClick={finish} className="mt-3 w-full py-1 text-center text-xs text-gray-500 hover:text-gray-300">
                Skip for now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
