import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileUpdateService } from '@core/api-mock/profile-update.service';

@Component({
  selector: 'app-reset',
  imports: [ChangeInformation, ReactiveFormsModule, TranslateModule],
  templateUrl: './reset.html',
  styleUrl: './reset.scss',
})
export class Reset {
  form: FormGroup;
  private profileUpdate = inject(ProfileUpdateService);

  constructor(private router: Router, private fb: FormBuilder) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.profileUpdate.setPendingEmail(this.form.value.email);
      this.router.navigate(['/admin/change-email/code-second']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/change-email/code-first']);
  }
}
