'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, ExternalLink, Zap } from 'lucide-react';
import type { Perk } from '@/types';
import { usePerksStore } from '@/store/usePerksStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface PerkCardProps {
  perk: Perk;
  onOpenDetail?: (perk: Perk) => void;
  index?: number;
}

const offerTypeColors: Record<string, string> = {
  credit: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  discount: 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  free_trial: 'border border-orange-500/20 bg-orange-500/10 text-orange-300',
  lifetime: 'border border-rose-500/20 bg-rose-500/10 text-rose-300',
};

const offerTypeLabels: Record<string, string> = {
  credit: 'Credit',
  discount: 'Discount',
  free_trial: 'Free Trial',
  lifetime: 'Lifetime',
};

export function formatValue(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

export function PerkCard({ perk, onOpenDetail, index = 0 }: PerkCardProps) {
  const { bookmarkedPerkIds, claimedPerkIds, toggleBookmark, addClaim } = usePerksStore();
  const isBookmarked = bookmarkedPerkIds.has(perk.id);
  const isClaimed = claimedPerkIds.has(perk.id);
  const supabase = createClient();

  async function handleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Sign in to save bookmarks');
      return;
    }
    if (isBookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('perk_id', perk.id);
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, perk_id: perk.id });
    }
    toggleBookmark(perk.id);
    toast.success(isBookmarked ? 'Bookmark removed' : 'Perk bookmarked');
  }

  async function handleClaim(e: React.MouseEvent) {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Sign in to claim perks');
      return;
    }
    if (isClaimed) {
      if (perk.redemption_link) window.open(perk.redemption_link, '_blank');
      return;
    }
    await supabase.from('perk_claims').insert({ user_id: user.id, perk_id: perk.id });
    await supabase.from('perks').update({ claim_count: perk.claim_count + 1 }).eq('id', perk.id);
    addClaim(perk.id);
    toast.success('Perk claimed! Redirecting...');
    if (perk.redemption_link) {
      setTimeout(() => window.open(perk.redemption_link!, '_blank'), 800);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-800 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:border-gray-700 hover:bg-white/[0.04] hover:shadow-lg"
      onClick={() => onOpenDetail?.(perk)}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-800 bg-white/[0.03]">
              {perk.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={perk.logo_url}
                  alt={perk.tool_name}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Zap className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{perk.tool_name}</h3>
              {perk.categories && (
                <span className="text-xs text-gray-400">{perk.categories.name}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleBookmark}
            className="rounded-lg p-1.5 text-gray-500 transition-all hover:bg-cyan-500/10 hover:text-cyan-400"
          >
            {isBookmarked
              ? <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              : <Bookmark className="w-4 h-4" />
            }
          </button>
        </div>

        <p className="mb-4 flex-1 line-clamp-2 text-sm leading-relaxed text-gray-400">
          {perk.short_description || perk.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
              <span className="text-sm font-bold text-emerald-300">
                {formatValue(perk.value_amount)}
              </span>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${offerTypeColors[perk.offer_type]}`}>
              {offerTypeLabels[perk.offer_type]}
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleClaim}
            className={`h-7 text-xs gap-1 px-3 ${
              isClaimed
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {isClaimed ? (
              <>
                <ExternalLink className="w-3 h-3" />
                Claimed
              </>
            ) : (
              'Claim now'
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
