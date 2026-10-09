import { PinGroupDirective } from '@shared/directives/pin-group.directive';
import { ResendCode } from '@shared/components/resend-code/resend-code';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { AuthService } from '@core/services/auth.service';
import { ChangePhoneService } from '@core/services/change-phone.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-code-second',
  imports: [ChangeInformation, ReactiveFormsModule, NgFor, TranslateModule, PinGroupDirective, ResendCode],
  templateUrl: './code-second.html',
  styleUrl: './code-second.scss',
})
export class CodeSecond {
  showConfirmation = false;
  readonly pinControls = new FormArray<FormControl<string>>(
    Array.from(
      { length: 6 },
      () => new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d$/)] }),
    ),
  );
  readonly form = new FormGroup({ pin: this.pinControls });
  readonly resendAction = () => this.changePhone.resendSms();
  isSubmitting = false;
  errorMessage = '';

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    this.pinControls.at(index).setValue(value);
    input.value = value;
    if (value && index < this.pinControls.length - 1) {
      (input.parentElement?.querySelectorAll('input')[index + 1] as HTMLElement | undefined)?.focus();
    }
  }

  private codeFailure(error: unknown): void {
    const key = error instanceof HttpErrorResponse && error.status === 429
      ? 'forgot_password.code.errors.rate_limited'
      : error instanceof HttpErrorResponse && error.status === 400
        ? 'forgot_password.code.errors.invalid'
        : 'forgot_password.code.errors.failed';
    this.errorMessage = this.translate.instant(key);
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private changePhone: ChangePhoneService,
    private translate: TranslateService,
  ) {
    if (!this.changePhone.hasRequestedSms) {
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
    this.changePhone.checkSms(this.pinControls.value.join('')).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => {
        this.showConfirmation = true;
      },
      error: (error: unknown) => {
        // 400: codigo incorrecto o vencido; 429: demasiados intentos.
        this.codeFailure(error);
      },
    });
  }

  accept() {
    this.showConfirmation = false;
    this.router.navigate(['/admin/profile']);
  }

  return() {
    this.router.navigate(['/admin/change-contact/reset']);
  }
}