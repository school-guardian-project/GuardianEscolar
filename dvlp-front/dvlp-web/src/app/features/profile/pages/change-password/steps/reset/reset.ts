import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../../../../../shared/validator/password-match.validator';
import { ChangePassword } from '../../../../../../shared/components/change/change-password/change-password';
import { MatDialog } from '@angular/material/dialog';
import { Confirmations } from '../../../../../../shared/components/modal/confirmations/confirmations';

@Component({
  selector: 'app-reset',
  imports: [ReactiveFormsModule, ChangePassword],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {
  form: FormGroup;
  readonly dialog = inject(MatDialog);

  constructor(private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[a-zA-Z0-9]$/g')]]
    }, {
      validators: [
        passwordMatch('password', 'confirmPassword')
      ]
    });
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
        titleDialog: 'Contraseña actualizado',
        descriptionDialog: 'Su contraseña ha sido actualizada correctamente.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'accept') {
        this.accept()
      }
    })
  }
  accept() {
    this.router.navigate(['/admin/informacion']);
  }

  return() {
    this.router.navigate(['/admin/change-password/code']);
  }
}
