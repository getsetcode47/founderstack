import { createAdminClient } from '@/lib/supabase/admin';
import { hasPaidAccess, isAdminRole } from '@/lib/founderstack';
import { normalizeEmail } from '@/lib/security/validation';
import { logAppError } from '@/lib/monitoring';
import type { Profile } from '@/types';

export interface OutreachRecipient {
  email: string;
  name: string | null;
  sources: ('free_members' | 'free_deal_leads')[];
  planType: Profile['plan_type'] | null;
  createdAt: string | null;
}

export interface OutreachAudienceSummary {
  freeMembersCount: number;
  freeDealLeadsCount: number;
  combinedCount: number;
}

export interface OutreachCampaignRecord {
  id: string;
  subject: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  completed_at: string | null;
}

function isMissingOpsTable(
  error: { message?: string; code?: string } | null,
  tableName: string
) {
  return !!error && (
    error.code === 'PGRST205' ||
    error.message?.includes(`Could not find the table 'public.${tableName}'`)
  );
}

function isMissingGiveawayLeadsTable(error: { message?: string; code?: string } | null) {
  return isMissingOpsTable(error, 'giveaway_leads');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatBodyHtml(message: string) {
  return escapeHtml(message).replace(/\n/g, '<br />');
}

function mergeSources(
  existing: OutreachRecipient['sources'] | undefined,
  next: OutreachRecipient['sources'][number]
): OutreachRecipient['sources'] {
  return Array.from(new Set([...(existing ?? []), next])) as OutreachRecipient['sources'];
}

async function listAllAuthUsers() {
  const supabase = createAdminClient();
  const users: Array<{
    id: string;
    email?: string | null;
    created_at?: string | null;
    user_metadata?: Record<string, any> | null;
  }> = [];

  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);

    const batch = (data?.users ?? []) as typeof users;
    users.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return users;
}

export async function getOutreachRecipients() {
  const supabase = createAdminClient();
  const [{ data: profiles, error: profilesError }, authUsers] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, username, role, created_at, subscription_status, subscription_period_end, lifetime_access, plan_type'),
    listAllAuthUsers(),
  ]);

  if (profilesError) throw new Error(profilesError.message || 'Unable to load profiles.');

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile as Partial<Profile> & { username?: string | null; created_at?: string }]));
  const recipientsByEmail = new Map<string, OutreachRecipient>();

  for (const user of authUsers) {
    const normalized = normalizeEmail(user.email);
    if (!normalized) continue;

    const profile = profileMap.get(user.id);
    if (isAdminRole(profile?.role)) continue;
    if (hasPaidAccess(profile as Partial<Profile>)) continue;

    const current = recipientsByEmail.get(normalized);
    const name =
      (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null) ||
      (typeof profile?.username === 'string' ? profile.username : null) ||
      null;

    recipientsByEmail.set(normalized, {
      email: normalized,
      name,
      sources: mergeSources(current?.sources, 'free_members'),
      planType: (profile?.plan_type as Profile['plan_type'] | undefined) ?? 'free',
      createdAt: user.created_at ?? profile?.created_at ?? null,
    });
  }

  const { data: giveawayLeads, error: giveawayError } = await supabase
    .from('giveaway_leads')
    .select('email, name, created_at')
    .order('created_at', { ascending: false });

  if (giveawayError && !isMissingGiveawayLeadsTable(giveawayError)) {
    throw new Error(giveawayError.message || 'Unable to load giveaway leads.');
  }

  for (const lead of giveawayLeads ?? []) {
    const normalized = normalizeEmail(lead.email);
    if (!normalized) continue;
    const current = recipientsByEmail.get(normalized);

    recipientsByEmail.set(normalized, {
      email: normalized,
      name: current?.name || (lead.name ? String(lead.name).trim() : null) || null,
      sources: mergeSources(current?.sources, 'free_deal_leads'),
      planType: current?.planType ?? null,
      createdAt: current?.createdAt ?? (lead.created_at ? String(lead.created_at) : null),
    });
  }

  const allRecipients = Array.from(recipientsByEmail.values()).sort((a, b) => +(new Date(b.createdAt || 0)) - +(new Date(a.createdAt || 0)));

  return {
    allRecipients,
    freeMembers: allRecipients.filter((recipient) => recipient.sources.includes('free_members')),
    freeDealLeads: allRecipients.filter((recipient) => recipient.sources.includes('free_deal_leads')),
  };
}

export async function getOutreachAudienceSummary(): Promise<OutreachAudienceSummary> {
  const audience = await getOutreachRecipients();
  return {
    freeMembersCount: audience.freeMembers.length,
    freeDealLeadsCount: audience.freeDealLeads.length,
    combinedCount: audience.allRecipients.length,
  };
}

export async function getRecentOutreachCampaigns(limit = 8) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('outreach_campaigns')
    .select('id, subject, status, recipient_count, sent_count, failed_count, created_at, completed_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (isMissingOpsTable(error, 'outreach_campaigns')) {
    return [];
  }

  if (error) throw new Error(error.message || 'Unable to load recent outreach campaigns.');
  return (data ?? []) as OutreachCampaignRecord[];
}

function validateCampaignInput({
  subject,
  message,
  ctaUrl,
}: {
  subject: string;
  message: string;
  ctaUrl?: string | null;
}) {
  if (!subject.trim()) return 'Email subject is required.';
  if (!message.trim()) return 'Email body is required.';
  if (ctaUrl) {
    try {
      const parsed = new URL(ctaUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return 'CTA link must use http or https.';
      }
    } catch {
      return 'CTA link must be a valid URL.';
    }
  }
  return null;
}

export async function queueOutreachCampaign({
  createdBy,
  subject,
  message,
  ctaLabel,
  ctaUrl,
  includeFreeMembers,
  includeFreeDealLeads,
}: {
  createdBy: string;
  subject: string;
  message: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  includeFreeMembers: boolean;
  includeFreeDealLeads: boolean;
}) {
  const validationError = validateCampaignInput({ subject, message, ctaUrl });
  if (validationError) throw new Error(validationError);
  if (!includeFreeMembers && !includeFreeDealLeads) throw new Error('Select at least one audience segment.');

  const audience = await getOutreachRecipients();
  const recipients = audience.allRecipients.filter((recipient) =>
    (includeFreeMembers && recipient.sources.includes('free_members')) ||
    (includeFreeDealLeads && recipient.sources.includes('free_deal_leads'))
  );

  if (recipients.length === 0) throw new Error('There are no matching recipients in the selected audience.');

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('outreach_campaigns')
    .insert({
      created_by: createdBy,
      subject: subject.trim(),
      message: message.trim(),
      cta_label: ctaLabel?.trim() || null,
      cta_url: ctaUrl?.trim() || null,
      include_free_members: includeFreeMembers,
      include_free_deal_leads: includeFreeDealLeads,
      status: 'queued',
      recipient_count: recipients.length,
    })
    .select('id, subject, status, recipient_count, sent_count, failed_count, created_at, completed_at')
    .maybeSingle();

  if (isMissingOpsTable(error, 'outreach_campaigns')) {
    throw new Error('Outreach campaigns table is not available yet. Apply the latest Supabase migration first.');
  }

  if (error) throw new Error(error.message || 'Unable to queue outreach campaign.');
  return data as OutreachCampaignRecord;
}

async function sendCampaignNow(campaign: {
  id: string;
  subject: string;
  message: string;
  cta_label: string | null;
  cta_url: string | null;
  include_free_members: boolean;
  include_free_deal_leads: boolean;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new Error('Resend is not configured yet.');
  }

  const audience = await getOutreachRecipients();
  const recipients = audience.allRecipients.filter((recipient) =>
    (campaign.include_free_members && recipient.sources.includes('free_members')) ||
    (campaign.include_free_deal_leads && recipient.sources.includes('free_deal_leads'))
  );

  const supabase = createAdminClient();
  const contentHtml = formatBodyHtml(campaign.message);
  const safeCtaLabel = campaign.cta_label?.trim() ? escapeHtml(campaign.cta_label.trim()) : null;
  const safeCtaUrl = campaign.cta_url?.trim() ? campaign.cta_url.trim() : null;

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  const concurrency = 8;

  await supabase
    .from('outreach_campaigns')
    .update({ status: 'processing', started_at: new Date().toISOString(), last_error: null })
    .eq('id', campaign.id);

  try {
    for (let i = 0; i < recipients.length; i += concurrency) {
      const chunk = recipients.slice(i, i + concurrency);
      const results = await Promise.allSettled(
        chunk.map(async (recipient) => {
          const greeting = recipient.name ? `Hi ${escapeHtml(recipient.name)},` : 'Hi there,';
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: process.env.RESEND_FROM_EMAIL,
              to: [recipient.email],
              subject: campaign.subject,
              html: `
                <div style="font-family:Arial,sans-serif;background:#07111f;color:#fff;padding:32px">
                  <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px;background:#0b1324">
                    <p style="font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#7dd3fc">FounderStackHub</p>
                    <h1 style="font-size:28px;line-height:1.2;margin:16px 0">A quick update from Founder Stack Hub</h1>
                    <p style="font-size:16px;line-height:1.7;color:#cbd5e1;margin:0 0 16px">${greeting}</p>
                    <div style="font-size:16px;line-height:1.8;color:#cbd5e1">${contentHtml}</div>
                    ${
                      safeCtaLabel && safeCtaUrl
                        ? `<div style="margin-top:28px"><a href="${safeCtaUrl}" style="display:inline-block;padding:14px 20px;border-radius:14px;background:#ffffff;color:#000000;text-decoration:none;font-weight:700">${safeCtaLabel}</a></div>`
                        : ''
                    }
                    <p style="font-size:14px;line-height:1.7;color:#94a3b8;margin-top:28px">You’re receiving this because you signed up on FounderStackHub or unlocked our free deals list.</p>
                  </div>
                </div>
              `,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Failed for ${recipient.email}`);
          }
        })
      );

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          sent += 1;
        } else {
          failed += 1;
          errors.push(result.reason instanceof Error ? result.reason.message : 'Unknown email send failure');
        }
      });
    }

    await supabase
      .from('outreach_campaigns')
      .update({
        status: failed > 0 ? 'failed' : 'completed',
        sent_count: sent,
        failed_count: failed,
        error_summary: errors.slice(0, 20),
        last_error: errors[0] ?? null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', campaign.id);

    return { sent, failed, total: recipients.length };
  } catch (error: any) {
    await supabase
      .from('outreach_campaigns')
      .update({
        status: 'failed',
        sent_count: sent,
        failed_count: failed,
        error_summary: errors.slice(0, 20),
        last_error: error?.message || 'Unknown outreach queue failure',
        completed_at: new Date().toISOString(),
      })
      .eq('id', campaign.id);

    await logAppError({
      source: 'outreach-processor',
      route: '/api/admin/outreach/process',
      message: error?.message || 'Outreach campaign processing failed',
      metadata: { campaignId: campaign.id, sent, failed },
    });

    throw error;
  }
}

export async function processQueuedOutreachCampaigns(limit = 3) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('outreach_campaigns')
    .select('id, subject, message, cta_label, cta_url, include_free_members, include_free_deal_leads')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message || 'Unable to load queued outreach campaigns.');

  const campaigns = data ?? [];
  const processed = [];
  for (const campaign of campaigns) {
    const result = await sendCampaignNow(campaign as any);
    processed.push({ id: (campaign as any).id, ...result });
  }
  return processed;
}
