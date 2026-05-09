import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment is not configured');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.from('categories').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      latency_ms: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        message:
          process.env.NODE_ENV === 'production'
            ? 'Service health check failed.'
            : err?.message ?? 'unknown',
      },
      { status: 503 }
    );
  }
}
