import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '@shared/validator/password-match.validator';
import { ChangePassword } from '@shared/components/change/change-password/change-password';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset',
  imports: [ReactiveFormsModule, ChangePassword, TranslateModule],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
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

  onSubmit() {
    if (this.form.valid) {
      this.showConfirmation = true;
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