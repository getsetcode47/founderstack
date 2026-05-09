import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { setSessionCookie } from '@/lib/auth-session';
import { getRequestIp } from '@/lib/security/request';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { isValidEmail, normalizeEmail } from '@/lib/security/validation';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = normalizeEmail(email);
    const nextPassword = String(password ?? '');

    if (!normalizedEmail || !nextPassword) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const requestIp = getRequestIp(request);
    const ipLimit = applyRateLimit(`auth:sign-in:ip:${requestIp}`, { windowMs: 10 * 60 * 1000, max: 15 });
    const emailLimit = applyRateLimit(`auth:sign-in:email:${normalizedEmail}`, { windowMs: 10 * 60 * 1000, max: 8 });

    if (!ipLimit.allowed || !emailLimit.allowed) {
      const retryAfter = Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds);
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const authClient = createAdminClient();
    const { data, error } = await authClient.auth.signInWithPassword({
      email: normalizedEmail,
      password: nextPassword,
    });
    if (error || !data.user) {
      const message =
        error?.message === 'Invalid API key'
          ? 'Authentication is temporarily unavailable. Please check the Supabase public key configuration.'
          : error?.message || 'Invalid login credentials.';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();

    const response = NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email ?? null,
        full_name: (data.user.user_metadata?.full_name as string | undefined) ?? null,
      },
      profile: profile ?? null,
    });

    setSessionCookie(response, {
      user: {
        id: data.user.id,
        email: data.user.email ?? null,
        full_name: (data.user.user_metadata?.full_name as string | undefined) ?? null,
      },
      profile: profile ?? null,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to sign in.' }, { status: 500 });
  }
}
