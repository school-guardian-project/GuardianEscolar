import { Component } from '@angular/core';
import { NavComponent } from '@shared/components/navbar/nav-component/nav-component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavComponent, MatIconModule, MatButtonModule, MatToolbarModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required]]
    })
  }

  login() {
    if (this.form.valid) {
      this.router.navigate(['/dashboard-admin'])
    } else {
      this.form.markAllAsTouched();
    }
  }

  forgot() {
    this.router.navigate(['/auth/forgot-password']);
  }

}