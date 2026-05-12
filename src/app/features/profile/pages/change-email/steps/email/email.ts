import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-email',
  imports: [ChangeInformation, ReactiveFormsModule, TranslateModule],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  // Represena un grupo de contenido dentro de un formulario, un objeto que representa todo el formulario
  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]]
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
