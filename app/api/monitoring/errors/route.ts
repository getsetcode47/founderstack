import { NextResponse, type NextRequest } from 'next/server';
import { logAppError } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await logAppError({
      source: String(body.source ?? 'client'),
      route: body.route ? String(body.route) : null,
      message: String(body.message ?? 'Unknown app error'),
      digest: body.digest ? String(body.digest) : null,
      metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : {},
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to log app error.' }, { status: 500 });
  }
}
