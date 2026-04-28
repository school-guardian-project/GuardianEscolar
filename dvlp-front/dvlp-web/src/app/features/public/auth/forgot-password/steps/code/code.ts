import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { NavComponent } from '../../../../../../shared/components/navbar/nav-component/nav-component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-code',
  imports: [NavComponent, MatIconModule, MatButtonModule, MatToolbarModule, FormsModule, NgIf],
  templateUrl: './code.html',
  styleUrl: './code.css',
})
export class Code {
  pin: string = '';
  pinError = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.pinError = '';

    if (!this.pin) {
      this.pinError = '*El codigo es requerido';
      return;
    }
    else {
      this.router.navigate(['/auth/forgot-password/reset']);
    }
  }

  login() {
    this.router.navigate(['/auth/login']);
  }
}
