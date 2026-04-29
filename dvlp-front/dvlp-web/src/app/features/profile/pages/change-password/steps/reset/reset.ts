import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../../../../../shared/validator/password-match.validator';
import { ChangePassword } from '../../../../../../shared/components/change/change-password/change-password';

@Component({
  selector: 'app-reset',
  imports: [ReactiveFormsModule, ChangePassword],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {
  form: FormGroup;

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
      this.router.navigate(['/admin/informacion']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/change-password/code']);
  }
}
