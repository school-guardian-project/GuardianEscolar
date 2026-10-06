import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChangePassword } from  '@shared/components/change/change-password/change-password';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatch } from '@shared/validator/password-match.validator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Confirmations } from '@shared/components/modal/confirmations/confirmations';
import { ForgotInformationService } from '@core/services/forgot-information.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [
    ChangePassword, 
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './reset.html',
  styleUrl: './reset.scss',
})
export class Reset {
  form: FormGroup;
  readonly dialog = inject(MatDialog);
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private forgotInformation: ForgotInformationService,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.\\-_])[A-Za-z\\d@$!%*?&.\\-_]{8,}$'
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [passwordMatch('password', 'confirmPassword')],
      }
    );

    if (!this.forgotInformation.hasVerifiedResetCode) {
      void this.router.navigate(['/auth/forgot-password/email']);
    }
  }

  get f() {
    return this.form.controls;
  }

  checkRule(regex: string): boolean {
    const value = this.form.get('password')?.value || '';
    return new RegExp(regex).test(value);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    const { password, confirmPassword } = this.form.getRawValue();

    this.forgotInformation.resetPassword(password, confirmPassword).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.openDialog(),
      error: (error: unknown) => {
        const key = error instanceof HttpErrorResponse && error.status === 429
          ? 'forgot_password.reset.errors.rate_limited'
          : error instanceof HttpErrorResponse && error.status === 400
            ? 'forgot_password.reset.errors.expired'
            : 'forgot_password.reset.errors.failed';
        this.errorMessage = this.translate.instant(key);
      },
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(Confirmations, {
      data: {
        titleDialog: this.translate.instant('forgot_password.reset.confirmationTitle'),
        descriptionDialog: this.translate.instant('forgot_password.reset.confirmationDescription'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'accept') {
        this.accept();
      }
    });
  }

  accept() {
    this.router.navigate(['/auth/login']);
  }

  return() {
    this.forgotInformation.clear();
    this.router.navigate(['/auth/login']);
  }
}