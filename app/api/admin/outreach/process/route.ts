import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';
import { processQueuedOutreachCampaigns } from '@/lib/admin-outreach';

function isAuthorizedToProcess(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (session?.user?.id && isAdminRole(session.profile?.role)) return true;

  const headerSecret = request.headers.get('x-outreach-queue-secret');
  return Boolean(
    process.env.OUTREACH_QUEUE_SECRET &&
    headerSecret &&
    headerSecret === process.env.OUTREACH_QUEUE_SECRET
  );
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedToProcess(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  try {
    const result = await processQueuedOutreachCampaigns();
    return NextResponse.json(
      { processed: result },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unable to process outreach queue.' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
