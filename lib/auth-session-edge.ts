import type { NextRequest } from 'next/server';
import type { AppSession } from '@/lib/auth-session';

const AUTH_COOKIE_NAME = 'fsh_session';

function getSessionSecret() {
  const configuredSecret =
    process.env.APP_SESSION_SECRET || process.env.FREE_DEALS_COOKIE_SECRET;

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'founderstackhub-dev-session-secret';
  }

  throw new Error('APP_SESSION_SECRET (or FREE_DEALS_COOKIE_SECRET) must be configured.');
}

async function signSessionPayload(payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Buffer.from(signature).toString('base64url');
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function decodeSessionForEdge(token: string | undefined | null): Promise<AppSession | null> {
  if (!token) return null;

  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expectedSignature = await signSessionPayload(payload);
    if (!safeEqual(expectedSignature, signature)) return null;

    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AppSession;
  } catch {
    return null;
  }
}

export async function getSessionFromEdgeRequest(request: NextRequest) {
  return decodeSessionForEdge(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}
