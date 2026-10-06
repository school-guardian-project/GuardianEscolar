import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { ChangeEmailService } from '@core/services/change-email.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset',
  imports: [ChangeInformation, ReactiveFormsModule, TranslateModule],
  templateUrl: './reset.html',
  styleUrl: './reset.scss',
})
export class Reset {
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private changeEmail: ChangeEmailService,
    private translate: TranslateService,
  ) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]]
    });

    if (!this.changeEmail.hasVerifiedCurrent) {
      void this.router.navigate(['/admin/change-email/email']);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    this.changeEmail.submitNewEmail(String(this.form.value.email)).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.router.navigate(['/admin/change-email/code-second']),
      error: (error: unknown) => {
        const status = error instanceof HttpErrorResponse ? error.status : 0;
        const key = status === 429 ? 'forgot_password.errors.rate_limited'
          : status === 409 ? 'change_email.errors.email_in_use'
          : status === 400 ? 'change_email.errors.invalid_request'
          : 'forgot_password.errors.request_failed';
        this.errorMessage = this.translate.instant(key);
      },
    });
  }

  return() {
    this.router.navigate(['/admin/change-email/code-first']);
  }
}