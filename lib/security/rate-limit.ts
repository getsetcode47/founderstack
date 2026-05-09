type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __founderStackHubRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

function getStore() {
  if (!global.__founderStackHubRateLimitStore) {
    global.__founderStackHubRateLimitStore = new Map();
  }

  return global.__founderStackHubRateLimitStore;
}

export function applyRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const store = getStore();

  if (store.size > 5000) {
    for (const [entryKey, entry] of Array.from(store.entries())) {
      if (entry.resetAt <= now) {
        store.delete(entryKey);
      }
    }
  }

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, options.max - 1),
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: existing.count <= options.max,
    remaining: Math.max(0, options.max - existing.count),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}
