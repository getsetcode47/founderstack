const INTERNAL_PATH_PATTERN = /^\/(?!\/)/;

export function normalizeInternalRedirect(
  redirectTo: string | null | undefined,
  fallback = '/deals'
) {
  if (!redirectTo) return fallback;

  const trimmed = redirectTo.trim();
  if (!INTERNAL_PATH_PATTERN.test(trimmed)) return fallback;

  try {
    const parsed = new URL(trimmed, 'http://founderstackhub.local');
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
