import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';
import { exportClaimsCsv, exportMembersCsv, exportOutreachAudienceCsv } from '@/lib/admin-exports';

export async function GET(
  request: NextRequest,
  { params }: { params: { kind: string } }
) {
  const session = getSessionFromRequest(request);
  if (!session?.user?.id || !isAdminRole(session.profile?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let csv = '';
    let filename = 'export.csv';

    if (params.kind === 'members') {
      csv = await exportMembersCsv();
      filename = 'founderstackhub-members.csv';
    } else if (params.kind === 'claims') {
      csv = await exportClaimsCsv();
      filename = 'founderstackhub-deal-claims.csv';
    } else if (params.kind === 'outreach') {
      csv = await exportOutreachAudienceCsv();
      filename = 'founderstackhub-outreach-audience.csv';
    } else {
      return NextResponse.json({ error: 'Unknown export kind.' }, { status: 404 });
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to export CSV.' }, { status: 500 });
  }
}
