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
import { ChangeEmailService } from '@core/services/change-email.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-code-first',
  imports: [ChangeInformation, ReactiveFormsModule, NgFor, TranslateModule, PinGroupDirective, ResendCode],
  templateUrl: './code-first.html',
  styleUrl: './code-first.scss',
})
export class CodeFirst {
  readonly pinControls = new FormArray<FormControl<string>>(
    Array.from(
      { length: 6 },
      () => new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d$/)] }),
    ),
  );
  readonly form = new FormGroup({ pin: this.pinControls });
  readonly resendAction = () => this.changeEmail.resendCurrent();
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
    private changeEmail: ChangeEmailService,
    private translate: TranslateService,
  ) {
    if (!this.changeEmail.hasRequested) {
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
    this.changeEmail.verifyCurrent(this.pinControls.value.join('')).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.router.navigate(['/admin/change-email/reset']),
      error: (error: unknown) => this.codeFailure(error),
    });
  }

  return() {
    this.changeEmail.clear();
    this.router.navigate(['/admin/change-email/email']);
  }
}