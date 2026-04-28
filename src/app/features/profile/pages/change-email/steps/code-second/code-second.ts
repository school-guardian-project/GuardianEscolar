import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeInformation } from "../../../../../../shared/components/change-information/change-information/change-information";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-code-second',
  imports: [ChangeInformation, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './code-second.html',
  styleUrl: './code-second.css',
})
export class CodeSecond {
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
      this.router.navigate(['/admin/informacion']);
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/change-email/reset']);
  }
}
