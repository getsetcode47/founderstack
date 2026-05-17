'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Brain, CheckCheck, Copy, Lightbulb, Loader2, Rocket, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

const startupStages = ['Idea', 'MVP', 'Early traction', 'Growth', 'Enterprise'];
const teamSizes = ['Solo', '2-5', '6-15', '16-30', '31+'];
const customerTypes = ['B2B', 'B2C', 'Marketplace', 'Developers', 'Students'];
const businessModels = ['AI', 'SaaS', 'Fintech', 'Ecommerce', 'Marketplace'];
const primaryGoals = [
  'Ship faster',
  'Acquire customers',
  'Reduce infrastructure cost',
  'Improve retention and support',
  'Set up ops and finance',
];
const priorityCategories = [
  'AI stack',
  'Product & engineering',
  'Sales & marketing',
  'Design & collaboration',
  'Finance & operations',
  'Support & analytics',
];
const goToMarketChannels = ['SEO', 'Cold outbound', 'Paid acquisition', 'Community growth', 'Partnerships', 'Product-led growth'];

interface Recommendation {
  id: string;
  slug: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  logo_image_url: string | null;
  discount_method: string;
}

interface OnboardingModalProps {
  userId: string;
  referralCode: string;
  onComplete: () => void;
  onDismiss: () => void;
}

function getLogoFallbackUrl(name: string) {
  const qs = new URLSearchParams({ name, brand: '#0ea5e9' });
  return `/api/logo?${qs.toString()}`;
}

export function OnboardingModal({ referralCode, onComplete, onDismiss }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [form, setForm] = useState({
    startupName: '',
    startupIdea: '',
    startupStage: '',
    teamSize: '',
    customerType: '',
    businessModel: '',
    primaryGoal: '',
    priorityCategories: [] as string[],
    goToMarketChannels: [] as string[],
  });

  function toggleSelection(field: 'priorityCategories' | 'goToMarketChannels', value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRecommendations() {
    setLoading(true);
    setError('');

    const response = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const payload = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(payload?.error || 'Unable to generate recommendations.');
      return;
    }

    setRecommendations(payload.recommendations ?? []);
    setStep(3);
  }

  function copyCode() {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  const canContinueStepOne =
    form.startupIdea.trim().length >= 20 &&
    form.startupStage &&
    form.teamSize &&
    form.customerType &&
    form.businessModel;

  const canGenerate =
    form.primaryGoal &&
    form.priorityCategories.length > 0 &&
    form.goToMarketChannels.length > 0;

  return (
    <Dialog open>
      <DialogContent className="max-w-5xl overflow-hidden border-gray-800 bg-[#020617] p-0 text-white [&>button]:hidden">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? 'bg-cyan-400' : 'bg-white/10'}`} />
            ))}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close onboarding"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-8 px-6 py-6 lg:grid-cols-[0.95fr_1.05fr]"
            >
              <div className="rounded-[28px] border border-cyan-500/20 bg-cyan-500/10 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-black/30">
                  <Brain className="h-6 w-6 text-cyan-300" />
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.22em] text-cyan-200/70">Founder AI setup</p>
                <h2 className="mt-3 text-3xl">Tell us what you&apos;re building.</h2>
                <p className="mt-4 text-sm leading-7 text-cyan-50/80">
                  We use your startup context to recommend the best credits, tools, and founder offers for your exact stack.
                </p>
                <div className="mt-8 space-y-3 text-sm text-cyan-50/80">
                  <div>1. Startup profile and stage</div>
                  <div>2. Growth priorities and GTM motion</div>
                  <div>3. Instant shortlist of 10 offers to claim next</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-gray-300">
                    <span>Startup name</span>
                    <input value={form.startupName} onChange={(e) => updateField('startupName', e.target.value)} className={inputClass} placeholder="Acme AI" />
                  </label>
                  <label className="space-y-2 text-sm text-gray-300">
                    <span>Stage</span>
                    <select value={form.startupStage} onChange={(e) => updateField('startupStage', e.target.value)} className={inputClass}>
                      <option value="">Select stage</option>
                      {startupStages.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                </div>

                <label className="space-y-2 text-sm text-gray-300">
                  <span>What are you building?</span>
                  <textarea
                    value={form.startupIdea}
                    onChange={(e) => updateField('startupIdea', e.target.value)}
                    className={`${inputClass} min-h-[130px] py-3`}
                    placeholder="Example: We're building an AI voice agent for sales teams that books demos, summarizes calls, and syncs insights into the CRM."
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="space-y-2 text-sm text-gray-300">
                    <span>Team size</span>
                    <select value={form.teamSize} onChange={(e) => updateField('teamSize', e.target.value)} className={inputClass}>
                      <option value="">Select team size</option>
                      {teamSizes.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-gray-300">
                    <span>Customer type</span>
                    <select value={form.customerType} onChange={(e) => updateField('customerType', e.target.value)} className={inputClass}>
                      <option value="">Select type</option>
                      {customerTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-gray-300">
                    <span>Business model</span>
                    <select value={form.businessModel} onChange={(e) => updateField('businessModel', e.target.value)} className={inputClass}>
                      <option value="">Select model</option>
                      {businessModels.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                </div>

                <Button onClick={() => setStep(2)} disabled={!canContinueStepOne} className="h-11 w-full bg-white text-black hover:bg-gray-100">
                  Continue to recommendations <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 px-6 py-6"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Recommendation tuning</p>
                <h2 className="mt-3 text-3xl">What do you need most right now?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
                  We’ll rank the best deals for your current stage, product, and GTM motion, then show you the top 10 offers to claim next.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-[24px] border border-gray-800 bg-white/[0.02] p-5 lg:col-span-1">
                  <p className="text-sm font-medium text-gray-300">Primary goal</p>
                  <div className="mt-4 space-y-2">
                    {primaryGoals.map((item) => (
                      <button key={item} onClick={() => updateField('primaryGoal', item)} className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${form.primaryGoal === item ? 'border-cyan-400 bg-cyan-500/10 text-white' : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-gray-800 bg-white/[0.02] p-5 lg:col-span-1">
                  <p className="text-sm font-medium text-gray-300">Priority stacks</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {priorityCategories.map((item) => (
                      <button key={item} onClick={() => toggleSelection('priorityCategories', item)} className={`rounded-full border px-4 py-2 text-sm transition ${form.priorityCategories.includes(item) ? 'border-emerald-400 bg-emerald-500/10 text-white' : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-gray-800 bg-white/[0.02] p-5 lg:col-span-1">
                  <p className="text-sm font-medium text-gray-300">Go-to-market channels</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {goToMarketChannels.map((item) => (
                      <button key={item} onClick={() => toggleSelection('goToMarketChannels', item)} className={`rounded-full border px-4 py-2 text-sm transition ${form.goToMarketChannels.includes(item) ? 'border-orange-400 bg-orange-500/10 text-white' : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="rounded-xl border border-red-900/80 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</p>}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={() => setStep(1)} className="h-11 border-gray-700 bg-transparent text-white hover:bg-white/5">
                  Back
                </Button>
                <Button onClick={handleRecommendations} disabled={loading || !canGenerate} className="h-11 flex-1 bg-white text-black hover:bg-gray-100">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Generate my top 10 offers <Sparkles className="ml-2 h-4 w-4" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 px-6 py-6"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Recommended for your stack</p>
                  <h2 className="mt-3 text-3xl">Here are your first 10 deals to explore.</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
                    These picks are based on your startup idea, stage, GTM motion, and priorities. You can revisit all of them from the deals page too.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-white/[0.02] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Referral code</p>
                  <button onClick={copyCode} className="mt-2 inline-flex items-center gap-2 text-sm text-white hover:text-cyan-300">
                    {copied ? <CheckCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {referralCode}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendations.slice(0, 10).map((deal) => (
                  <div key={deal.slug} className="rounded-[24px] border border-gray-800 bg-black p-5 shadow-[0_18px_36px_rgba(0,0,0,0.3)]">
                    <div className="flex items-start gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-gray-800 bg-white/[0.03]">
                        <Image
                          src={deal.logo_image_url || getLogoFallbackUrl(deal.name)}
                          alt={deal.name}
                          fill
                          className="object-contain p-2"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg text-white">{deal.name}</p>
                        <p className="mt-1 text-sm text-gray-400">{deal.category}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-300">{deal.headline}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">{deal.description}</p>
                    <Link href={`/deal/${deal.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200">
                      View offer <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="rounded-[24px] border border-gray-800 bg-cyan-500/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-cyan-400/20 bg-black/20 p-3">
                    <Lightbulb className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-lg text-white">Next step</p>
                    <p className="mt-2 text-sm leading-7 text-cyan-50/80">
                      As FounderStackHub grows, this recommendation layer can be upgraded into a true AI agent that personalizes your stack continuously as new deals are discovered.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={onComplete} className="h-11 flex-1 bg-white text-black hover:bg-gray-100">
                  Start exploring my stack <Rocket className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={onDismiss}
                  className="h-11 border-gray-700 bg-transparent text-white hover:bg-white/5"
                >
                  Close for now
                </Button>
                <Link href="/deals" className="inline-flex h-11 items-center justify-center rounded-md border border-gray-700 px-4 text-sm text-white hover:border-gray-500">
                  Browse full catalog
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

const inputClass =
  'h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white focus:border-gray-600 focus:outline-none [&>option]:bg-[#020617] [&>option]:text-white';
