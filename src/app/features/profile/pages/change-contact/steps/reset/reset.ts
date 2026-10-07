import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { ChangePhoneService, phoneValidator } from '@core/services/change-phone.service';
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
    private changePhone: ChangePhoneService,
    private translate: TranslateService,
  ) {
    // E.164: +<codigo de pais><numero>, p. ej. +573001234567

    this.form = this.fb.group({
      telephone: ['', [Validators.required, phoneValidator]]
    });

    if (!this.changePhone.hasVerifiedIdentity) {
      void this.router.navigate(['/admin/change-contact/telephone']);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    this.changePhone.requestSms(String(this.form.value.telephone)).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.router.navigate(['/admin/change-contact/code-second']),
      error: (error: unknown) => {
        const status = error instanceof HttpErrorResponse ? error.status : 0;
        const key = status === 429 ? 'forgot_password.errors.rate_limited'
          : status === 503 ? 'change_contact.errors.sms_unavailable'
          : status === 400 ? 'change_contact.errors.invalid_phone'
          : 'forgot_password.errors.request_failed';
        this.errorMessage = this.translate.instant(key);
      },
    });
  }

  return() {
    this.router.navigate(['/admin/change-contact/code-first']);
  }
}