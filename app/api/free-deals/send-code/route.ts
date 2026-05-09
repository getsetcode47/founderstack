import { NextResponse } from 'next/server';
import { FREE_DEALS_PENDING_COOKIE, createPendingFreeDealsToken, generateFreeDealsCode } from '@/lib/free-deals';
import { getRequestIp } from '@/lib/security/request';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { isValidEmail, normalizeEmail } from '@/lib/security/validation';

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = String(name ?? '').trim() || null;

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const requestIp = getRequestIp(request);
    const ipLimit = applyRateLimit(`free-deals:send:ip:${requestIp}`, { windowMs: 60 * 60 * 1000, max: 10 });
    const emailLimit = applyRateLimit(`free-deals:send:email:${normalizedEmail}`, { windowMs: 60 * 60 * 1000, max: 5 });

    if (!ipLimit.allowed || !emailLimit.allowed) {
      const retryAfter = Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds);
      return NextResponse.json(
        { error: 'Too many verification requests. Please wait before requesting another code.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    if (!isResendConfigured()) {
      return NextResponse.json({ error: 'Email verification is not configured yet.' }, { status: 503 });
    }

    const code = generateFreeDealsCode();
    const pending = createPendingFreeDealsToken(normalizedEmail, normalizedName, code);

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [normalizedEmail],
        subject: 'Your FounderStackHub free deals verification code',
        html: `
          <div style="font-family:Arial,sans-serif;background:#07111f;color:#fff;padding:32px">
            <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px;background:#0b1324">
              <p style="font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#7dd3fc">FounderStackHub</p>
              <h1 style="font-size:28px;line-height:1.2;margin:16px 0">Verify your email to unlock the free deals.</h1>
              <p style="font-size:16px;line-height:1.7;color:#cbd5e1">Use this 6-digit code on the free deals page. It expires in 15 minutes.</p>
              <div style="margin:28px 0;padding:18px 20px;border-radius:18px;background:#000;border:1px solid rgba(255,255,255,0.1);font-size:32px;font-weight:700;letter-spacing:0.35em;text-align:center">${code}</div>
              <p style="font-size:14px;line-height:1.7;color:#94a3b8">If you didn’t request this, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      return NextResponse.json({ error: 'Unable to send verification email right now.' }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(FREE_DEALS_PENDING_COOKIE, pending.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to send verification code.' }, { status: 500 });
  }
}
