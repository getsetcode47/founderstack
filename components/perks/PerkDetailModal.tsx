'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkCheck, ExternalLink, Calendar, Tag, Zap, Users } from 'lucide-react';
import type { Perk } from '@/types';
import { usePerksStore } from '@/store/usePerksStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { formatValue } from './PerkCard';

interface PerkDetailModalProps {
  perk: Perk;
  onClose: () => void;
}

const offerTypeLabels: Record<string, string> = {
  credit: 'API Credit',
  discount: 'Discount',
  free_trial: 'Free Trial',
  lifetime: 'Lifetime Deal',
};

export function PerkDetailModal({ perk, onClose }: PerkDetailModalProps) {
  const { bookmarkedPerkIds, claimedPerkIds, toggleBookmark, addClaim } = usePerksStore();
  const isBookmarked = bookmarkedPerkIds.has(perk.id);
  const isClaimed = claimedPerkIds.has(perk.id);
  const supabase = createClient();

  async function handleBookmark() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Sign in to bookmark perks'); return; }
    if (isBookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('perk_id', perk.id);
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, perk_id: perk.id });
    }
    toggleBookmark(perk.id);
    toast.success(isBookmarked ? 'Bookmark removed' : 'Perk bookmarked');
  }

  async function handleClaim() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Sign in to claim perks'); return; }
    if (!isClaimed) {
      await supabase.from('perk_claims').insert({ user_id: user.id, perk_id: perk.id });
      await supabase.from('perks').update({ claim_count: perk.claim_count + 1 }).eq('id', perk.id);
      addClaim(perk.id);
      toast.success('Perk claimed successfully!');
    }
    if (perk.redemption_link) window.open(perk.redemption_link, '_blank');
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-gray-800 bg-[#020617] text-white">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-800 bg-white/[0.03]">
              {perk.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={perk.logo_url} alt={perk.tool_name} width={56} height={56} className="w-full h-full object-cover" />
              ) : (
                <Zap className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{perk.tool_name}</DialogTitle>
              {perk.categories && (
                <span className="text-sm text-gray-400">{perk.categories.name}</span>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="text-lg font-bold text-emerald-300">
                {formatValue(perk.value_amount)} value
              </span>
            </div>
            <Badge variant="secondary" className="border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">{offerTypeLabels[perk.offer_type]}</Badge>
          </div>

          <p className="text-sm leading-relaxed text-gray-300">
            {perk.description}
          </p>

          <div className="space-y-2.5 text-sm">
            {perk.expiry_date && (
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Expires {new Date(perk.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{perk.claim_count.toLocaleString()} founders have claimed this perk</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-white/[0.03] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-300">How to redeem</p>
            <ol className="list-inside list-decimal space-y-1.5 text-sm text-gray-400">
              <li>Click &quot;Claim Now&quot; below to go to the offer page</li>
              <li>Sign up or log into your {perk.tool_name} account</li>
              <li>Apply the offer code or follow the startup program instructions</li>
              <li>Credits or discounts will be applied automatically</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleClaim}
              className={`h-10 flex-1 gap-2 ${isClaimed ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              <ExternalLink className="w-4 h-4" />
              {isClaimed ? 'Claimed — Visit again' : 'Claim now'}
            </Button>
            <Button variant="outline" onClick={handleBookmark} className="h-10 border-gray-700 bg-black px-4 text-white hover:bg-white/5">
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
