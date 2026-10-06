import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '@shared/validator/password-match.validator';
import { ChangePassword } from '@shared/components/change/change-password/change-password';
import { AuthService } from '@core/services/auth.service';
import { ChangePasswordStateService } from '../../../../services/change-password-state.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset',
  imports: [ReactiveFormsModule, ChangePassword, TranslateModule],
  templateUrl: './reset.html',
  styleUrl: './reset.scss',
})
export class Reset {
  form: FormGroup;
  showConfirmation = false;
  serverError = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private state: ChangePasswordStateService,
  ) {
    this.form = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [passwordMatch('password', 'confirmPassword')],
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  checkRule(regex: string): boolean {
    const value = this.form.get('password')?.value || '';
    return new RegExp(regex).test(value);
  }

  onSubmit() {
    if (this.form.valid) {
      this.serverError = false;
      const currentPassword = this.state.currentPassword;
      if (!currentPassword) {
        // Sin la contraseña del primer paso no hay nada que enviar; no debería
        // ocurrir porque el flujo siempre entra por current-password.
        this.serverError = true;
        return;
      }
      this.authService.changePassword(currentPassword, this.form.get('password')?.value ?? '').subscribe({
        next: () => {
          this.state.reset();
          this.showConfirmation = true;
        },
        error: () => {
          // 400: contraseña actual incorrecta o nueva inválida; 401: sesión
          // expirada (el interceptor la repone o redirige a login).
          this.serverError = true;
          this.form.markAllAsTouched();
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  accept() {
    this.showConfirmation = false;
    this.router.navigate(['/admin/profile']);
  }

  return() {
    this.router.navigate(['/admin/change-password/current-password']);
  }
}