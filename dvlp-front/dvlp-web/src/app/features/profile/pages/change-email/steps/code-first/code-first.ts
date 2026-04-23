import { Component } from '@angular/core';
import { NavComponent } from "../../../../../../shared/components/navbar/nav-component/nav-component";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-code-first',
  imports: [NavComponent, FormsModule, NgIf, MatIcon],
  templateUrl: './code-first.html',
  styleUrl: './code-first.css',
})
export class CodeFirst {
  pinError: string = '';
  pin: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.pinError = '';

    if (!this.pin) {
      this.pinError = '*El codigo es requerido'
    } else {
      this.router.navigate(['../reset']);
    }
  }

  return() {
    this.router.navigate(['./email'])
  }
}
