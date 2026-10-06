import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-telephone',
  imports: [ChangeInformation, ReactiveFormsModule, TranslateModule],
  templateUrl: './telephone.html',
  styleUrl: './telephone.scss',
})
export class Telephone {
  form: FormGroup;
  // No existe backend de cambio de teléfono (ms-iam solo expone change-password):
  // el flujo se detiene aquí con un aviso en lugar de fingir pasos de verificación.
  unavailable = false;

  constructor(private router: Router, private fb: FormBuilder) {
    const patternNumber = /^\+?[1-9]\d{1,14}$/;
    this.form = this.fb.group({
      telephone: ['', [Validators.required, Validators.pattern(patternNumber)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.unavailable = true;
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/profile']);
  }
}
