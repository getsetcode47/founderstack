export const COOKIE_CONSENT_COOKIE = 'fsh_cookie_consent';
export const USER_PREFERENCES_COOKIE = 'fsh_user_prefs';

export type CookieConsentMode = 'essential' | 'all';

export function serializeCookie(name: string, value: string, maxAgeSeconds: number) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

export function createCookieConsentValue(mode: CookieConsentMode) {
  return JSON.stringify({
    mode,
    savedAt: new Date().toISOString(),
    version: 1,
  });
}

export function createUserPreferencesValue(mode: CookieConsentMode) {
  return JSON.stringify({
    cookies: mode,
    marketingDismissed: false,
    updatedAt: new Date().toISOString(),
  });
}
