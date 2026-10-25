// Minimal in-memory sliding-window rate limiter for the public /api/apply
// endpoint (brief section 29).
//
// NOTE: this resets whenever the server process restarts and is per-instance
// only, so on a multi-instance serverless deployment (e.g. several Vercel
// lambdas) it limits "per warm instance", not globally. That's an acceptable
// first line of defense against basic bot/spam abuse; for stronger
// guarantees, swap this for a shared store such as Upstash Redis
// (`@upstash/ratelimit`) — the call site in app/api/apply/route.ts is
// isolated behind the `checkRateLimit` function below so that swap is a
// one-file change.

interface Bucket {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const buckets = new Map<string, Bucket>();

// Periodically forget stale buckets so this Map can't grow forever on a
// long-lived server process.
function pruneStaleBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  if (buckets.size > 5000) pruneStaleBuckets(now);

  const existing = buckets.get(identifier);
  if (!existing || now - existing.windowStart > WINDOW_MS) {
    buckets.set(identifier, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - existing.windowStart) };
  }

  existing.count += 1;
  return { allowed: true };
}

/** Best-effort client IP extraction behind common proxies (Vercel, etc). */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
