import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

/**
 * Puts API validation messages on the matching field ("Username ..." on
 * username, "Password ..." on password); returns what fits no field.
 */
export function applyServerErrors(
  form: FormGroup,
  error: HttpErrorResponse,
): string | null {
  if (error.status === 0) {
    return 'Unable to reach the server. Check your connection and try again.';
  }
  const raw = (error.error as { message?: string | string[] } | null)?.message;
  const messages = ([] as string[]).concat(raw ?? 'Something went wrong. Please try again.');
  const unmatched: string[] = [];

  for (const message of messages) {
    const field = /^username/i.test(message)
      ? 'username'
      : /^password/i.test(message)
        ? 'password'
        : null;
    const control = field ? form.get(field) : null;
    if (control) {
      control.setErrors({ ...control.errors, server: message });
      control.markAsTouched();
    } else {
      unmatched.push(message);
    }
  }
  return unmatched.length ? unmatched.join('. ') : null;
}

/** Only same-app paths, so ?returnUrl= cannot redirect off-site. */
export function safeReturnUrl(url: string | null | undefined): string {
  return url && url.startsWith('/') && !url.startsWith('//')
    ? url
    : '/dashboard';
}
