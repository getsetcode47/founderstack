import Link from 'next/link';
import { createAnonClient } from '@/lib/supabase/anon';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Perk } from '@/types';
import { FeaturedPerksClient } from './FeaturedPerksClient';

export async function FeaturedPerks() {
  const supabase = createAnonClient();
  const { data: perks } = await supabase
    .from('perks')
    .select('*, categories(*)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('value_amount', { ascending: false })
    .limit(8);

  return (
    <section id="deals" className="py-24 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-[0.2em]">Featured Deals</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">
            Top-value tools for your stack.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Handpicked deals from the tools used by the fastest-growing startups.
          </p>
        </div>

        <FeaturedPerksClient perks={perks as Perk[] ?? []} />

        <div className="text-center mt-12">
          <Link href="/perks">
            <Button
              size="lg"
              className="gap-2 h-12 px-8 bg-white/5 hover:bg-white/10 border border-white/20 text-white"
            >
              View all 500+ deals
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
