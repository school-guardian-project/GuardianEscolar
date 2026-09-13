import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '@shared/validator/password-match.validator';
import { ChangePassword } from '@shared/components/change/change-password/change-password';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileUpdateService } from '@core/api-mock/profile-update.service';

@Component({
  selector: 'app-reset',
  imports: [ReactiveFormsModule, ChangePassword, TranslateModule],
  templateUrl: './reset.html',
  styleUrl: './reset.scss',
})
export class Reset {
  form: FormGroup;
  showConfirmation = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
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

  private profileUpdate = inject(ProfileUpdateService);

  onSubmit() {
    if (this.form.valid) {
      const newPass = this.form.value.password;
      this.profileUpdate.updatePassword(newPass).subscribe({
        next: () => {
          console.log('[MOCK-API] updatePassword OK');
          this.router.navigate(['/admin/informacion']);
        },
        error: (e) => {
          console.warn('[MOCK-API] updatePassword FAIL', e.message);
          this.router.navigate(['/admin/informacion']);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  accept() {
    this.showConfirmation = false;
    this.router.navigate(['/admin/informacion']);
  }

  return() {
    this.router.navigate(['/admin/change-password/code']);
  }
}