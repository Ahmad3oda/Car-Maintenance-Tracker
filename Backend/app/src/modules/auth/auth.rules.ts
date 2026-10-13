/** Shared with the frontend forms (Frontend/src/app/features/auth/auth.rules.ts). */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const PASSWORD_MIN = 6;
/** bcrypt only uses the first 72 bytes of a password. */
export const PASSWORD_MAX = 72;

export const USERNAME_MESSAGES = {
  length: `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters`,
  start: 'Username must start with a letter',
  chars: 'Username may only contain English letters, digits and underscores',
};

export const PASSWORD_MESSAGES = {
  min: `Password must be at least ${PASSWORD_MIN} characters`,
  max: `Password must be at most ${PASSWORD_MAX} characters`,
};

export const normalizeUsername = (username: string) => username.toLowerCase();
