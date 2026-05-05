import { Component, inject } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { Confirmations } from '@shared/components/modal/confirmations/confirmations';

@Component({
  selector: 'app-reset',
  imports: [ChangePassword, FormsModule, ReactiveFormsModule],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {
  form: FormGroup;
  readonly dialog = inject(MatDialog);

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
      this.openDialog();
    } else {
      this.form.markAllAsTouched();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(Confirmations, {
      data: {
        titleDialog: 'Contraseña restablecida',
        descriptionDialog: 'Su contraseña ha sido restablecida correctamente.',
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
    this.router.navigate(['/auth/login']);
  }
}
