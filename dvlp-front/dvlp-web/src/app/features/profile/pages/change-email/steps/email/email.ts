import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { AuthService } from '@core/services/auth.service';
import { ChangeEmailService } from '@core/services/change-email.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-email',
  imports: [ChangeInformation, ReactiveFormsModule, TranslateModule],
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
    private changeEmail: ChangeEmailService,
    private translate: TranslateService,
  ) {
    // El código siempre se envía al correo de la sesión; el usuario no puede cambiarlo.
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
    this.changeEmail.request(email).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.router.navigate(['/admin/change-email/code-first']),
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
    this.changeEmail.clear();
    this.router.navigate(['/admin/profile']);
  }
}