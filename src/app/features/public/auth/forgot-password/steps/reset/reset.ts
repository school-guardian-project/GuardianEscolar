import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePassword } from '@shared/components/change/change-password/change-password';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatch } from '@shared/validator/password-match.validator';

@Component({
  selector: 'app-reset',
  imports: [ChangePassword, FormsModule, ReactiveFormsModule],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {
  form: FormGroup;

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

  // Toma el valor del campo de la contraseña. Y devuelve true o false 
  // para validar se es igual o no. Para validar los requisitos que debe tener la contraseña.
  // Crea una expresion regular con el texto que se le pase
  // (regex) y devuelve true o false.
  checkRule(regex: string): boolean {
    const value = this.form.get('password')?.value || '';
    return new RegExp(regex).test(value);
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/admin/informacion']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/auth/login']);
  }
}
