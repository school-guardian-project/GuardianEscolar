import { PinGroupDirective } from '@shared/directives/pin-group.directive';
import { ResendCode } from '@shared/components/resend-code/resend-code';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ChangePassword } from '@shared/components/change/change-password/change-password';
import { ForgotInformationService } from '@core/services/forgot-information.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-code',
  imports: [ChangePassword, ReactiveFormsModule, NgFor, TranslateModule, PinGroupDirective, ResendCode],
  templateUrl: './code.html',
  styleUrl: './code.scss',
})
export class Code {
  readonly pinControls = new FormArray<FormControl<string>>(
    Array.from(
      { length: 6 },
      () => new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d$/)] }),
    ),
  );
  readonly form = new FormGroup({ pin: this.pinControls });
  readonly resendAction = () => this.forgotInformation.resendCode();
  isSubmitting = false;
  errorMessage = '';

  @ViewChildren('pinInput') private pinInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private router: Router,
    private forgotInformation: ForgotInformationService,
    private translate: TranslateService,
  ) {
    if (!this.forgotInformation.hasRequestedReset) {
      void this.router.navigate(['/auth/forgot-password/email']);
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    this.pinControls.at(index).setValue(value);
    input.value = value;
    if (value && index < this.pinControls.length - 1) {
      this.pinInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    const code = this.pinControls.value.join('');

    this.forgotInformation.verifyPasswordResetCode(code).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.router.navigate(['/auth/forgot-password/reset']),
      error: (error: unknown) => {
        const key = error instanceof HttpErrorResponse && error.status === 429
          ? 'forgot_password.code.errors.rate_limited'
          : error instanceof HttpErrorResponse && error.status === 400
            ? 'forgot_password.code.errors.invalid'
            : 'forgot_password.code.errors.failed';
        this.errorMessage = this.translate.instant(key);
      },
    });
  }

  return() {
    this.router.navigate(['/auth/forgot-password/email']);
  }

}