import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangePassword } from '../../../../../../shared/components/change/change-password/change-password';
import { ChangePasswordStateService } from '../../../../services/change-password-state.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-current-password',
  imports: [ChangePassword, ReactiveFormsModule, TranslateModule],
  templateUrl: './current-password.html',
  styleUrl: './current-password.scss',
})
export class CurrentPassword {
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private state: ChangePasswordStateService,
  ) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // El backend la exige en el mismo POST que la nueva; se pasa por memoria.
      this.state.currentPassword = this.form.get('currentPassword')?.value ?? null;
      this.router.navigate(['/admin/change-password/reset']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.state.reset();
    this.router.navigate(['/admin/profile']);
  }
}