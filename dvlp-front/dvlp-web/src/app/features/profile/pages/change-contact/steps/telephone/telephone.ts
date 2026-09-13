import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileUpdateService } from '@core/api-mock/profile-update.service';

@Component({
  selector: 'app-telephone',
  imports: [ChangeInformation, ReactiveFormsModule, TranslateModule],
  templateUrl: './telephone.html',
  styleUrl: './telephone.scss',
})
export class Telephone {
  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    const patternNumber = /^\+?[1-9]\d{1,14}$/;
    this.form = this.fb.group({
      telephone: ['', [Validators.required, Validators.pattern(patternNumber)]]
    });
  }

  private profileUpdate = inject(ProfileUpdateService);

  onSubmit() {
    if (this.form.valid) {
      this.profileUpdate.setPendingPhone(this.form.value.telephone);
      this.router.navigate(['/admin/change-contact/code-first']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/informacion']);
  }
}
