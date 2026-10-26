import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { WheelSpinnerComponent } from '../../../shared/components/wheel-spinner/wheel-spinner.component';
import { AuthShellComponent } from '../auth-shell/auth-shell.component';
import { applyServerErrors } from '../auth-errors';
import {
  PASSWORD_MESSAGES,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
  errorMessage,
  passwordRules,
  usernameRules,
} from '../auth.rules';

const passwordsMatch = (group: AbstractControl): ValidationErrors | null =>
  group.get('password')?.value === group.get('confirmPassword')?.value
    ? null
    : { mismatch: true };

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthShellComponent,
    WheelSpinnerComponent,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group(
    {
      username: ['', usernameRules],
      password: ['', passwordRules],
      confirmPassword: [''],
    },
    { validators: passwordsMatch },
  );

  readonly hints = {
    username: `${USERNAME_MIN}-${USERNAME_MAX} characters. Starts with a letter; English letters, digits and _ only.`,
    password: `At least ${PASSWORD_MIN} characters.`,
  };

  submitting = false;
  showPassword = false;
  formError: string | null = null;

  showError(field: 'username' | 'password'): string | null {
    const control = this.form.controls[field];
    return control.touched ? errorMessage(control) : null;
  }

  get confirmError(): string | null {
    const confirm = this.form.controls.confirmPassword;
    return confirm.touched && this.form.hasError('mismatch')
      ? PASSWORD_MESSAGES.mismatch
      : null;
  }

  submit(): void {
    this.formError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { username, password } = this.form.getRawValue();
    this.auth.register(username, password).subscribe({
      next: () => void this.router.navigateByUrl('/dashboard'),
      error: (error: HttpErrorResponse) => {
        this.submitting = false;
        // 409 "Username ... is already taken" lands on the username field.
        this.formError = applyServerErrors(this.form, error);
      },
    });
  }
}
