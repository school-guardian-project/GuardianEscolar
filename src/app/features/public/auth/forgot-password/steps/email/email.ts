import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ChangePassword } from '@shared/components/change/change-password/change-password'; 


@Component({
  selector: 'app-email',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    ChangePassword  
  ],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService   
  ) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]]
    });
  }

  // Getter para traducciones (opcional, pero si lo usas en el template)
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