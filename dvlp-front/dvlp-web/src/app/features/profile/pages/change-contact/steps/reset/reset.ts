import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset',
  imports: [ChangeInformation, ReactiveFormsModule],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {
  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    const patternNumber = /^\+?[1-9]\d{1,14}$/;
    this.form = this.fb.group({
      telephone: ['', [Validators.required, Validators.pattern(patternNumber)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/admin/change-contact/code-second']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/change-contact/code-first']);
  }
}
