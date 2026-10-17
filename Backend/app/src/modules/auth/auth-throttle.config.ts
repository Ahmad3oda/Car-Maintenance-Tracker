/** Login/register attempts allowed per client IP in each window. */
export const AUTH_THROTTLE_TTL_MS = 60_000;

/** Defaults to 10 per minute; AUTH_RATE_LIMIT overrides it (tests raise it). */
export function authThrottleLimit(): number {
  const limit = Number(process.env.AUTH_RATE_LIMIT);
  return Number.isInteger(limit) && limit > 0 ? limit : 10;
}
