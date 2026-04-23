import { Component } from '@angular/core';
import { NavComponent } from "../../../../../../shared/components/navbar/nav-component/nav-component";
import { Router } from '@angular/router';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-email',
  imports: [NavComponent, MatIcon, MatIconModule, FormsModule, NgIf],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  email: string = '';
  emailError: string = '';
  constructor(private router: Router) {}

  onSubmit() {
    this.emailError = '';
    
    if (!this.email) {
      this.emailError = '*El correo es requerido'
    } else {
      this.router.navigate(['../code-first']);
    }
  }

  adminInfo() {
    this.router.navigate(['/admin/informacion'])
  }
}
