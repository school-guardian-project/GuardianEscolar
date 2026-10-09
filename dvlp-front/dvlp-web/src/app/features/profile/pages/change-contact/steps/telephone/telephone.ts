import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { requestErrorKey } from '@core/services/request-error';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { AuthService } from '@core/services/auth.service';
import { ChangePhoneService, phoneValidator } from '@core/services/change-phone.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-telephone',
  imports: [ChangeInformation, ReactiveFormsModule, TranslateModule],
  templateUrl: './telephone.html',
  styleUrl: './telephone.scss',
})
export class Telephone {
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private changePhone: ChangePhoneService,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      telephone: ['', [Validators.required, phoneValidator]],
    });
  }

  onSubmit() {
    // El perfil se identifica con el correo de la sesión; el usuario solo escribe su teléfono actual.
    const email = String(this.authService.session.email ?? '').trim();
    if (this.form.invalid || !email) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    this.changePhone.request(email, String(this.form.value.telephone)).pipe(
      finalize(() => { this.isSubmitting = false; }),
    ).subscribe({
      next: () => this.router.navigate(['/admin/change-contact/code-first']),
      error: (error: unknown) => {
        this.errorMessage = this.translate.instant(requestErrorKey(error, 'change_contact.errors.invalid_phone'));
      },
    });
  }

  return() {
    this.changePhone.clear();
    this.router.navigate(['/admin/profile']);
  }
}