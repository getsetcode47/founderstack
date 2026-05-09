import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';
import { getOutreachAudienceSummary, getRecentOutreachCampaigns, queueOutreachCampaign } from '@/lib/admin-outreach';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session?.user?.id || !isAdminRole(session.profile?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [summary, campaigns] = await Promise.all([
      getOutreachAudienceSummary(),
      getRecentOutreachCampaigns(),
    ]);
    return NextResponse.json({ ...summary, campaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to load outreach audience.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session?.user?.id || !isAdminRole(session.profile?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await queueOutreachCampaign({
      createdBy: session.user.id,
      subject: String(body.subject ?? ''),
      message: String(body.message ?? ''),
      ctaLabel: body.ctaLabel ? String(body.ctaLabel) : null,
      ctaUrl: body.ctaUrl ? String(body.ctaUrl) : null,
      includeFreeMembers: Boolean(body.includeFreeMembers),
      includeFreeDealLeads: Boolean(body.includeFreeDealLeads),
    });

    return NextResponse.json({ campaign: result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to send outreach campaign.' }, { status: 500 });
  }
}
