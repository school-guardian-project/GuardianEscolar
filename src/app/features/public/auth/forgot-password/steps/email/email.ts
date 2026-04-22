import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavComponent } from '../../../../../../shared/components/navbar/nav-component/nav-component';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email',
  imports: [NavComponent, MatIconModule, MatButtonModule, MatToolbarModule, NgIf, FormsModule],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  email: string = '';
  emailError = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.emailError = '';

    if (!this.email) {
      this.emailError = '*El correo es requerido';
    } else {
      this.router.navigate(['/auth/forgot-password/code']);
    }
  }

  login() {
    this.router.navigate(['/auth/login']);
  }
}
