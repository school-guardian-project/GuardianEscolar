import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePassword } from '@shared/components/change/change-password/change-password';
import { ForgotInformationService } from '@core/services/forgot-information.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-email',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    ChangePassword  
  ],
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
    private translate: TranslateService,
    private forgotInformation: ForgotInformationService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    });
  }

  // Getter para traducciones (opcional, pero si lo usas en el template)
  get t() {
    return (key: string) => this.translate.instant(key);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.forgotInformation.requestPasswordReset(String(this.form.get('email')?.value ?? '').trim()).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.router.navigate(['/auth/forgot-password/code']),
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
    this.router.navigate(['/auth/login']);
  }
}