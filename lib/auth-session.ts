import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';
import type { Profile } from '@/types';

export const AUTH_COOKIE_NAME = 'fsh_session';

export interface AppSessionUser {
  id: string;
  email: string | null;
  full_name?: string | null;
}

export interface AppSession {
  user: AppSessionUser;
  profile: Partial<Profile> | null;
}

function getSessionSecret() {
  const configuredSecret =
    process.env.APP_SESSION_SECRET || process.env.FREE_DEALS_COOKIE_SECRET;

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'founderstackhub-dev-session-secret';
  }

  return null;
}

function signSessionPayload(payload: string) {
  const secret = getSessionSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function encodeSession(session: AppSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = signSessionPayload(payload);
  if (!signature) {
    throw new Error('APP_SESSION_SECRET (or FREE_DEALS_COOKIE_SECRET) must be configured.');
  }
  return `${payload}.${signature}`;
}

export function decodeSession(token: string | undefined | null): AppSession | null {
  if (!token) return null;

  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const signed = signSessionPayload(payload);
    if (!signed) return null;

    const expectedSignature = Buffer.from(signed, 'utf8');
    const receivedSignature = Buffer.from(signature, 'utf8');

    if (expectedSignature.length !== receivedSignature.length) return null;
    if (!timingSafeEqual(expectedSignature, receivedSignature)) return null;

    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AppSession;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest) {
  return decodeSession(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

export function setSessionCookie(response: NextResponse, session: AppSession) {
  response.cookies.set(AUTH_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
