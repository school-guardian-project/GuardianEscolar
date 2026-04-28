import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ChangeInformation } from "../../../../../../shared/components/change-information/change-information/change-information";
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-code-first',
  imports: [ChangeInformation, ReactiveFormsModule, CommonModule, MatIcon],
  templateUrl: './code-first.html',
  styleUrl: './code-first.css',
})
export class CodeFirst {
  form: FormGroup
  constructor(private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      pin: this.fb.array(
        Array.from({ length: 6 }, () =>
          this.fb.control('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9]$')
          ])
        )
      )
    })
  }

  get pinControls() {
    return this.form.get('pin') as any;
  }

  onInput(event: any, index: number) {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const control = this.pinControls.at(index);
    control.setValue(value, { emitEvent: false });

    // mover al siguiente input
    if (value && index < 5) {
      const inputs = document.querySelectorAll('input');
      (inputs[index + 1] as HTMLElement)?.focus();
    }
  }

  onSubmit() {
    const pin = this.pinControls.value.join('');
    if (this.form.valid) {
      this.router.navigate(['/admin/change-email/reset']);
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/change-email/email'])
  }
}
