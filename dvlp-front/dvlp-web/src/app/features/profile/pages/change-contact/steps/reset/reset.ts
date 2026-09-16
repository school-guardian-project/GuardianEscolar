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
    const patternNumber = /^\+?[1-9]\d{1,14}$/;
    this.form = this.fb.group({
      telephone: ['', [Validators.required, Validators.pattern(patternNumber)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.profileUpdate.setPendingPhone(this.form.value.telephone);
      this.router.navigate(['/admin/change-contact/code-second']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/change-contact/code-first']);
  }
}
