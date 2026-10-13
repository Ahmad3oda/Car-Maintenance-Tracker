import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Mirrors Backend/app/src/modules/auth/auth.rules.ts; keep them in sync.
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 72;

export const USERNAME_MESSAGES = {
  required: 'Username is required',
  length: `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters`,
  start: 'Username must start with a letter',
  chars: 'Username may only contain English letters, digits and underscores',
};

export const PASSWORD_MESSAGES = {
  required: 'Password is required',
  min: `Password must be at least ${PASSWORD_MIN} characters`,
  max: `Password must be at most ${PASSWORD_MAX} characters`,
  mismatch: 'Passwords do not match',
};

/** Same checks, in the same order, as the API's RegisterDto. */
export const usernameRules: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = String(control.value ?? '');
  if (!value) return { usernameRule: USERNAME_MESSAGES.required };
  if (value.length < USERNAME_MIN || value.length > USERNAME_MAX) {
    return { usernameRule: USERNAME_MESSAGES.length };
  }
  if (!/^[A-Za-z]/.test(value)) return { usernameRule: USERNAME_MESSAGES.start };
  if (!/^[A-Za-z0-9_]*$/.test(value)) {
    return { usernameRule: USERNAME_MESSAGES.chars };
  }
  return null;
};

export const passwordRules: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = String(control.value ?? '');
  if (!value) return { passwordRule: PASSWORD_MESSAGES.required };
  if (value.length < PASSWORD_MIN) return { passwordRule: PASSWORD_MESSAGES.min };
  if (value.length > PASSWORD_MAX) return { passwordRule: PASSWORD_MESSAGES.max };
  return null;
};

/** First error message of a control, from the rules above or the server. */
export function errorMessage(control: AbstractControl | null): string | null {
  const errors = control?.errors;
  if (!errors) return null;
  return (
    errors['usernameRule'] ??
    errors['passwordRule'] ??
    errors['server'] ??
    (errors['required'] ? 'This field is required' : null)
  );
}
