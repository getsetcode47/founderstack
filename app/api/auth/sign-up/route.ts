import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { setSessionCookie } from '@/lib/auth-session';
import { getRequestIp } from '@/lib/security/request';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { isValidEmail, normalizeEmail, validatePasswordStrength } from '@/lib/security/validation';

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();
    const normalizedEmail = normalizeEmail(email);
    const nextPassword = String(password ?? '');
    const normalizedFullName = String(fullName ?? '').trim();

    if (!normalizedEmail || !nextPassword) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const passwordError = validatePasswordStrength(nextPassword);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const requestIp = getRequestIp(request);
    const ipLimit = applyRateLimit(`auth:sign-up:ip:${requestIp}`, { windowMs: 60 * 60 * 1000, max: 8 });
    const emailLimit = applyRateLimit(`auth:sign-up:email:${normalizedEmail}`, { windowMs: 60 * 60 * 1000, max: 3 });

    if (!ipLimit.allowed || !emailLimit.allowed) {
      const retryAfter = Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds);
      return NextResponse.json(
        { error: 'Too many signup attempts. Please wait before trying again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const supabase = createAdminClient();
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: nextPassword,
      email_confirm: true,
      user_metadata: { full_name: normalizedFullName || '' },
    });

    if (createError || !created.user) {
      return NextResponse.json({ error: createError?.message || 'Unable to create account.' }, { status: 400 });
    }

    await supabase.from('profiles').upsert({
      id: created.user.id,
      username: normalizedFullName || normalizedEmail.split('@')[0],
      role: 'free',
      onboarding_completed: false,
      interests: [],
      lifetime_access: false,
      plan_type: 'free',
    });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', created.user.id).maybeSingle();

    const response = NextResponse.json({
      user: {
        id: created.user.id,
        email: created.user.email ?? null,
        full_name: (created.user.user_metadata?.full_name as string | undefined) ?? null,
      },
      profile: profile ?? null,
    });

    setSessionCookie(response, {
      user: {
        id: created.user.id,
        email: created.user.email ?? null,
        full_name: (created.user.user_metadata?.full_name as string | undefined) ?? null,
      },
      profile: profile ?? null,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to create account.' }, { status: 500 });
  }
}
