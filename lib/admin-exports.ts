import { createAdminClient } from '@/lib/supabase/admin';
import { getOutreachRecipients } from '@/lib/admin-outreach';
import { normalizeEmail } from '@/lib/security/validation';

function csvEscape(value: unknown) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(headers: string[], rows: unknown[][]) {
  return [headers.map(csvEscape).join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');
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
    const batch = data?.users ?? [];
    users.push(...(batch as any[]));
    if (batch.length < perPage) break;
    page += 1;
  }

  return users;
}

export async function exportMembersCsv() {
  const supabase = createAdminClient();
  const [{ data: profiles, error: profilesError }, authUsers] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, username, role, referral_code, onboarding_completed, created_at, subscription_status, lifetime_access, plan_type'),
    listAllAuthUsers(),
  ]);

  if (profilesError) throw new Error(profilesError.message);

  const authMap = new Map(authUsers.map((user) => [user.id, user]));
  const rows = (profiles ?? []).map((profile: any) => {
    const authUser = authMap.get(profile.id);
    return [
      profile.id,
      normalizeEmail(authUser?.email),
      profile.username,
      profile.role,
      profile.plan_type,
      profile.subscription_status,
      profile.lifetime_access,
      profile.referral_code,
      profile.onboarding_completed,
      authUser?.created_at ?? profile.created_at,
    ];
  });

  return toCsv(
    ['user_id', 'email', 'username', 'role', 'plan_type', 'subscription_status', 'lifetime_access', 'referral_code', 'onboarding_completed', 'created_at'],
    rows
  );
}

export async function exportClaimsCsv() {
  const supabase = createAdminClient();
  const [authUsers, claimsResult] = await Promise.all([
    listAllAuthUsers(),
    supabase
      .from('deal_claims')
      .select('id, user_id, deal_id, created_at, deals(name, deal_headline)')
      .order('created_at', { ascending: false }),
  ]);

  if (claimsResult.error) throw new Error(claimsResult.error.message);

  const authMap = new Map(authUsers.map((user) => [user.id, user]));
  const rows = (claimsResult.data ?? []).map((claim: any) => [
    claim.id,
    claim.user_id,
    normalizeEmail(authMap.get(claim.user_id)?.email),
    claim.deal_id,
    Array.isArray(claim.deals) ? claim.deals[0]?.name : claim.deals?.name,
    Array.isArray(claim.deals) ? claim.deals[0]?.deal_headline : claim.deals?.deal_headline,
    claim.created_at,
  ]);

  return toCsv(
    ['claim_id', 'user_id', 'email', 'deal_id', 'deal_name', 'deal_headline', 'created_at'],
    rows
  );
}

export async function exportOutreachAudienceCsv() {
  const recipients = await getOutreachRecipients();
  const rows = recipients.allRecipients.map((recipient) => [
    recipient.email,
    recipient.name,
    recipient.sources.join('|'),
    recipient.planType,
    recipient.createdAt,
  ]);

  return toCsv(
    ['email', 'name', 'sources', 'plan_type', 'created_at'],
    rows
  );
}
