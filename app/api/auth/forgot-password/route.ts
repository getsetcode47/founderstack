import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getRequestIp } from '@/lib/security/request';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { isValidEmail, normalizeEmail } from '@/lib/security/validation';

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const requestIp = getRequestIp(request);
    const ipLimit = applyRateLimit(`auth:forgot-password:ip:${requestIp}`, {
      windowMs: 60 * 60 * 1000,
      max: 10,
    });
    const emailLimit = applyRateLimit(`auth:forgot-password:email:${normalizedEmail}`, {
      windowMs: 60 * 60 * 1000,
      max: 5,
    });

    if (!ipLimit.allowed || !emailLimit.allowed) {
      const retryAfter = Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds);
      return NextResponse.json(
        { error: 'Too many reset requests. Please wait before trying again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    if (!isResendConfigured()) {
      return NextResponse.json({ error: 'Password recovery email is not configured yet.' }, { status: 503 });
    }

    const origin = request.headers.get('origin') || new URL(request.url).origin;
    const redirectTo = `${origin}/reset-password`;

    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: normalizedEmail,
      options: { redirectTo },
    });

    const actionLink = (data as any)?.properties?.action_link ?? (data as any)?.action_link;

    if (!error && actionLink) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: [normalizedEmail],
          subject: 'Reset your FounderStackHub password',
          html: `
            <div style="font-family:Arial,sans-serif;background:#07111f;color:#fff;padding:32px">
              <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px;background:#0b1324">
                <p style="font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#7dd3fc">FounderStackHub</p>
                <h1 style="font-size:28px;line-height:1.2;margin:16px 0">Reset your password</h1>
                <p style="font-size:16px;line-height:1.7;color:#cbd5e1">Click the button below to set a new password for your account.</p>
                <div style="margin-top:28px">
                  <a href="${actionLink}" style="display:inline-block;padding:14px 20px;border-radius:14px;background:#ffffff;color:#000000;text-decoration:none;font-weight:700">Reset password</a>
                </div>
                <p style="font-size:14px;line-height:1.7;color:#94a3b8;margin-top:28px">If you did not request this, you can safely ignore this email.</p>
              </div>
            </div>
          `,
        }),
      }).catch(() => null);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unable to send the reset email.' },
      { status: 500 }
    );
  }
}
