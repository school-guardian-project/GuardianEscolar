import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangePassword } from '@shared/components/change/change-password/change-password';
import { AuthService } from '@core/services/auth.service';
import { ForgotInformationService } from '@core/services/forgot-information.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-email',
  imports: [ReactiveFormsModule, ChangePassword, TranslateModule],
  templateUrl: './email.html',
  styleUrl: './email.scss',
})
export class Email {
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private forgotInformation: ForgotInformationService,
    private translate: TranslateService,
  ) {
    // El destinatario es siempre el correo de la sesión iniciada; el usuario no puede cambiarlo.
    this.form = this.fb.group({
      email: [{ value: this.authService.session.email ?? '', disabled: true }],
    });
  }

  onSubmit() {
    const email = String(this.form.getRawValue().email ?? '').trim();
    if (!email) {
      this.errorMessage = this.translate.instant('forgot_password.errors.request_failed');
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.forgotInformation.requestPasswordReset(email).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.router.navigate(['/admin/change-password/code']),
      error: (error: unknown) => {
        this.errorMessage = this.translate.instant(
          error instanceof HttpErrorResponse && error.status === 429
            ? 'forgot_password.errors.rate_limited'
            : 'forgot_password.errors.request_failed',
        );
      },
    });
  }

  return() {
    this.forgotInformation.clear();
    this.router.navigate(['/admin/profile']);
  }
}