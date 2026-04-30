import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";

@Component({
  selector: 'app-email',
  imports: [ChangeInformation, ReactiveFormsModule],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  // Represena un grupo de contenido dentro de un formulario, un objeto que representa todo el formulario
  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/admin/change-email/code-first']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/informacion']);
  }
}
