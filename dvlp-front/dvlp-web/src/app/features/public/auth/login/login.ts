import { Component } from '@angular/core';
import { NavComponent } from '../../../../shared/components/navbar/nav-component/nav-component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavComponent, MatIconModule, MatButtonModule, MatToolbarModule, FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  password: string = '';
  emailError = '';
  passwordError = '';

  constructor(private router: Router) { }

  login(form: any) {
    this.emailError = '';
    this.passwordError = '';

    if (!this.email) {
      this.emailError = '*El correo es requerido';
    }

    if (!this.password) {
      this.passwordError = '*La contraseña es requerida';
    }
  }

  forgot() {
    this.router.navigate(['/auth/forgot-password']);
  }

}