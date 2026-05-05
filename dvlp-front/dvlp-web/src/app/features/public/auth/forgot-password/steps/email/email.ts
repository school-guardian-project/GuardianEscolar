import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangePassword } from '@shared/components/change/change-password/change-password';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email',
  imports: [FormsModule, ReactiveFormsModule, ChangePassword, TranslateModule, CommonModule],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private translate: TranslateService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get t() {
    return (key: string) => this.translate.instant(key);
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/auth/forgot-password/code']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/auth/login']);
  }
}