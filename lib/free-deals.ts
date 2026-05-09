import { createHash, createHmac, randomInt, timingSafeEqual } from 'crypto';

export const FREE_DEAL_FLAG = '__FREE_DEAL__';
export const FREE_DEALS_PENDING_COOKIE = 'fsh_free_deals_pending';
export const FREE_DEALS_VERIFIED_COOKIE = 'fsh_free_deals_verified';

export interface FreeDealsPendingPayload {
  email: string;
  name: string | null;
  codeHash: string;
  expiresAt: number;
}

export interface FreeDealsVerifiedPayload {
  email: string;
  name: string | null;
  verifiedAt: number;
}

function getFreeDealsSecret() {
  if (process.env.FREE_DEALS_COOKIE_SECRET) {
    return process.env.FREE_DEALS_COOKIE_SECRET;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'founderstackhub-free-deals-dev-secret';
  }

  throw new Error('FREE_DEALS_COOKIE_SECRET must be configured.');
}

function signValue(value: string) {
  return createHmac('sha256', getFreeDealsSecret()).update(value).digest('base64url');
}

function encodeSignedPayload(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signValue(body);
  return `${body}.${signature}`;
}

function decodeSignedPayload<T>(token: string | undefined | null): T | null {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature || signValue(body) !== signature) return null;

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

function hashVerificationCode(email: string, code: string, expiresAt: number) {
  return createHash('sha256').update(`${email.toLowerCase()}|${code}|${expiresAt}`).digest('hex');
}

export function generateFreeDealsCode() {
  return String(randomInt(100000, 999999));
}

export function createPendingFreeDealsToken(email: string, name: string | null, code: string) {
  const expiresAt = Date.now() + 1000 * 60 * 15;
  const payload: FreeDealsPendingPayload = {
    email: email.toLowerCase(),
    name,
    codeHash: hashVerificationCode(email, code, expiresAt),
    expiresAt,
  };

  return {
    token: encodeSignedPayload(payload),
    expiresAt,
  };
}

export function readPendingFreeDealsToken(token: string | undefined | null) {
  const payload = decodeSignedPayload<FreeDealsPendingPayload>(token);
  if (!payload || payload.expiresAt < Date.now()) return null;
  return payload;
}

export function verifyFreeDealsCode(token: string | undefined | null, code: string) {
  const payload = readPendingFreeDealsToken(token);
  if (!payload) return null;

  const expected = Buffer.from(payload.codeHash, 'hex');
  const received = Buffer.from(hashVerificationCode(payload.email, code, payload.expiresAt), 'hex');

  if (expected.length !== received.length) return null;
  if (!timingSafeEqual(expected, received)) return null;
  return payload;
}

export function createVerifiedFreeDealsToken(email: string, name: string | null) {
  return encodeSignedPayload({
    email: email.toLowerCase(),
    name,
    verifiedAt: Date.now(),
  });
}

export function readVerifiedFreeDealsToken(token: string | undefined | null) {
  return decodeSignedPayload<FreeDealsVerifiedPayload>(token);
}

export function hasFreeDealFlag(value: string | null | undefined) {
  return (value ?? '').includes(FREE_DEAL_FLAG);
}

export function stripFreeDealFlag(value: string | null | undefined) {
  const cleaned = (value ?? '')
    .replace(FREE_DEAL_FLAG, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned || null;
}

export function applyFreeDealFlag(value: string | null | undefined, enabled: boolean) {
  const cleaned = stripFreeDealFlag(value);
  if (!enabled) return cleaned;
  return cleaned ? `${cleaned}\n${FREE_DEAL_FLAG}` : FREE_DEAL_FLAG;
}
