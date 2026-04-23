import { Component } from '@angular/core';
import { NavComponent } from '../../../../../../shared/components/navbar/nav-component/nav-component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset',
  imports: [NavComponent, MatIconModule, MatButtonModule, MatToolbarModule, FormsModule, NgIf],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {
  newPassword: string = '';
  newPasswordError = '';
  confirmPassword: string = '';
  confirmPasswordError = '';
  confirmPasswordGood = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    this.confirmPasswordGood = '';

    if (!this.newPassword || !this.confirmPassword) {
      if (!this.newPassword) {
        this.newPasswordError = '*La nueva contraseña es requerida';
        return;
      }
      if (!this.confirmPassword) {
        this.confirmPasswordError = '*La confirmación de la contraseña es requerida';
        return;
      }
    } else if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = '*Las contraseñas no coinciden';
      return;
    } else {
      // this.confirmPasswordGood = '✓ las constraseñas coinciden';
      this.router.navigate(['/auth/login']);
    }
  }

  login() {
    this.router.navigate(['/auth/login']);
  }
}
