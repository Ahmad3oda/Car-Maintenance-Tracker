/** Seven days, in seconds. */
export const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

const MIN_SECRET_LENGTH = 32;

/** Reads JWT_SECRET; the app refuses to start without a strong one. */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be set to at least ${MIN_SECRET_LENGTH} characters ` +
        '(generate one with: openssl rand -hex 32)',
    );
  }
  return secret;
}
