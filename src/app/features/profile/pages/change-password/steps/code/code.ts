import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePassword } from '../../../../../../shared/components/change/change-password/change-password';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-code',
  imports: [ChangePassword, ReactiveFormsModule, NgFor, TranslateModule],
  templateUrl: './code.html',
  styleUrl: './code.css',
})
export class Code {
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
      this.router.navigate(['/admin/change-password/reset']);
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/change-password/email']);
  }
}
