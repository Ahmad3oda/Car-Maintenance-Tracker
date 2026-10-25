import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { WheelSpinnerComponent } from '../../../shared/components/wheel-spinner/wheel-spinner.component';
import { AuthShellComponent } from '../auth-shell/auth-shell.component';
import { applyServerErrors, safeReturnUrl } from '../auth-errors';
import { PASSWORD_MESSAGES, USERNAME_MESSAGES } from '../auth.rules';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthShellComponent,
    WheelSpinnerComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Login only checks presence; the format rules apply at registration.
  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  readonly messages = {
    username: USERNAME_MESSAGES.required,
    password: PASSWORD_MESSAGES.required,
  };

  readonly sessionExpired =
    this.route.snapshot.queryParamMap.get('reason') === 'expired';
  submitting = false;
  showPassword = false;
  formError: string | null = null;

  showError(field: 'username' | 'password'): string | null {
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) return null;
    return (control.errors['server'] as string) ?? this.messages[field];
  }

  submit(): void {
    this.formError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { username, password } = this.form.getRawValue();
    this.auth.login(username.trim(), password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(safeReturnUrl(returnUrl));
      },
      error: (error: HttpErrorResponse) => {
        this.submitting = false;
        // A wrong login is not specific to one field.
        this.formError =
          error.status === 401
            ? 'Invalid username or password'
            : applyServerErrors(this.form, error);
      },
    });
  }
}
