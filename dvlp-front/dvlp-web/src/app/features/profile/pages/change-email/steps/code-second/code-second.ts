import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileUpdateService } from '@core/api-mock/profile-update.service';

@Component({
  selector: 'app-code-second',
  imports: [ChangeInformation, FormsModule, ReactiveFormsModule, NgFor, NgIf, TranslateModule],
  templateUrl: './code-second.html',
  styleUrl: './code-second.scss',
})
export class CodeSecond {
  form: FormGroup;
  showConfirmation = false;

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
    // [MOCK-API] Para demo, cualquier código vale — actualiza directo sin confirmación extra
    if (this.form.valid) {
      const pending = this.profileUpdate.getPendingEmail();
      if (pending) {
        this.profileUpdate.updateEmail(pending).subscribe({
          next: () => {
            console.log('[MOCK-API] updateEmail OK', pending);
            this.profileUpdate.clearPending();
            this.router.navigate(['/admin/informacion']);
          },
          error: (e) => {
            console.warn('[MOCK-API] updateEmail FAIL', e.message);
            this.router.navigate(['/admin/informacion']);
          },
        });
      } else {
        this.router.navigate(['/admin/informacion']);
      }
    } else {
      // Para demo, aun con pin incompleto deja continuar
      const pending = this.profileUpdate.getPendingEmail();
      if (pending) {
        this.profileUpdate.updateEmail(pending).subscribe({
          next: () => {
            console.log('[MOCK-API] updateEmail OK (pin no validado)', pending);
            this.profileUpdate.clearPending();
            this.router.navigate(['/admin/informacion']);
          },
          error: (e) => {
            console.warn('[MOCK-API] updateEmail FAIL', e.message);
            this.router.navigate(['/admin/informacion']);
          },
        });
      } else {
        this.form.markAllAsTouched();
      }
    }
  }

  private profileUpdate = inject(ProfileUpdateService);

  accept() {
    this.showConfirmation = false;
    this.router.navigate(['/admin/informacion']);
  }

  return() {
    this.router.navigate(['/admin/change-email/reset']);
  }
}