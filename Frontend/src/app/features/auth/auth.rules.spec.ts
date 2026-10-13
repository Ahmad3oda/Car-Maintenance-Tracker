import { FormControl } from '@angular/forms';
import {
  PASSWORD_MESSAGES,
  USERNAME_MESSAGES,
  errorMessage,
  passwordRules,
  usernameRules,
} from './auth.rules';

const usernameError = (value: string) =>
  errorMessage(new FormControl(value, usernameRules));
const passwordError = (value: string) =>
  errorMessage(new FormControl(value, passwordRules));

describe('auth form rules', () => {
  it('accepts valid usernames', () => {
    for (const name of ['abc', 'Ahmed_92', 'a'.repeat(30), 'a_1']) {
      expect(usernameError(name)).withContext(name).toBeNull();
    }
  });

  it('rejects invalid usernames with the API messages', () => {
    const cases: [string, string][] = [
      ['', USERNAME_MESSAGES.required],
      ['ab', USERNAME_MESSAGES.length],
      ['a'.repeat(31), USERNAME_MESSAGES.length],
      ['1abc', USERNAME_MESSAGES.start],
      ['_abc', USERNAME_MESSAGES.start],
      ['ahmed-1', USERNAME_MESSAGES.chars],
      ['ahmed 1', USERNAME_MESSAGES.chars],
      ['ahméd', USERNAME_MESSAGES.chars],
    ];
    for (const [name, message] of cases) {
      expect(usernameError(name)).withContext(name).toBe(message);
    }
  });

  it('checks password length', () => {
    expect(passwordError('')).toBe(PASSWORD_MESSAGES.required);
    expect(passwordError('12345')).toBe(PASSWORD_MESSAGES.min);
    expect(passwordError('123456')).toBeNull();
    expect(passwordError('x'.repeat(73))).toBe(PASSWORD_MESSAGES.max);
  });
});
