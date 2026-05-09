'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { COOKIE_CONSENT_COOKIE, USER_PREFERENCES_COOKIE, createCookieConsentValue, createUserPreferencesValue, serializeCookie, type CookieConsentMode } from '@/lib/cookie-preferences';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

function readCookie(name: string) {
  if (typeof document === 'undefined') return null;

  const value = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');

  return value ? decodeURIComponent(value) : null;
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = readCookie(COOKIE_CONSENT_COOKIE);
    setVisible(!existing);
  }, []);

  const bannerClass = useMemo(
    () =>
      'fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-4xl rounded-[24px] border border-white/10 bg-[#0A0F1E]/95 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur',
    []
  );

  function saveConsent(mode: CookieConsentMode) {
    document.cookie = serializeCookie(
      COOKIE_CONSENT_COOKIE,
      createCookieConsentValue(mode),
      COOKIE_MAX_AGE
    );
    document.cookie = serializeCookie(
      USER_PREFERENCES_COOKIE,
      createUserPreferencesValue(mode),
      COOKIE_MAX_AGE
    );
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={bannerClass}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Cookie Preferences</p>
          <h2 className="mt-2 text-xl font-semibold">We use cookies to keep your account secure and save preferences.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Founder Stack Hub uses essential cookies for sign-in, billing access, and free-deal verification.
            You can also allow preference cookies so we remember your experience choices across visits.
          </p>
          <Link href="/cookie-policy" className="mt-3 inline-flex text-sm text-slate-400 underline underline-offset-4 hover:text-white">
            Read the cookie policy
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveConsent('essential')}
            className="inline-flex h-11 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-medium text-white transition hover:bg-white/5"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => saveConsent('all')}
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-medium text-black transition hover:bg-slate-200"
          >
            Accept all cookies
          </button>
        </div>
      </div>
    </div>
  );
}
