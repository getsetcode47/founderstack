import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getRequestIp } from '@/lib/security/request';
import { applyRateLimit } from '@/lib/security/rate-limit';
import {
  FREE_DEALS_PENDING_COOKIE,
  FREE_DEALS_VERIFIED_COOKIE,
  createVerifiedFreeDealsToken,
  verifyFreeDealsCode,
} from '@/lib/free-deals';

function isMissingGiveawayLeadsTable(error: { message?: string; code?: string } | null) {
  return !!error && (
    error.code === 'PGRST205' ||
    error.message?.includes("Could not find the table 'public.giveaway_leads'")
  );
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const normalizedCode = String(code ?? '').trim();

    if (!/^\d{6}$/.test(normalizedCode)) {
      return NextResponse.json({ error: 'Enter the 6-digit code from your email.' }, { status: 400 });
    }

    const requestIp = getRequestIp(request);
    const ipLimit = applyRateLimit(`free-deals:verify:ip:${requestIp}`, { windowMs: 15 * 60 * 1000, max: 15 });

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please wait and try again.' },
        { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfterSeconds) } }
      );
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${FREE_DEALS_PENDING_COOKIE}=`))
      ?.slice(FREE_DEALS_PENDING_COOKIE.length + 1);

    const pending = verifyFreeDealsCode(token, normalizedCode);
    if (!pending) {
      return NextResponse.json({ error: 'That code is invalid or has expired.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('giveaway_leads').insert({
      email: pending.email,
      name: pending.name ?? '',
    });

    if (error && error.code !== '23505' && !isMissingGiveawayLeadsTable(error)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(FREE_DEALS_PENDING_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
    response.cookies.set(FREE_DEALS_VERIFIED_COOKIE, createVerifiedFreeDealsToken(pending.email, pending.name), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to verify your email.' }, { status: 500 });
  }
}
