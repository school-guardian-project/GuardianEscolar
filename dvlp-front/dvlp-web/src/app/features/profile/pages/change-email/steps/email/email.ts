import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { TranslateModule } from '@ngx-translate/core';
import { ProfileUpdateService } from '@core/api-mock/profile-update.service';

@Component({
  selector: 'app-email',
  imports: [ChangeInformation, ReactiveFormsModule, TranslateModule],
  templateUrl: './email.html',
  styleUrl: './email.scss',
})
export class Email {
  // Represena un grupo de contenido dentro de un formulario, un objeto que representa todo el formulario
  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]]
    });
  }

  private profileUpdate = inject(ProfileUpdateService);

  onSubmit() {
    if (this.form.valid) {
      // [MOCK-API] Guarda email pendiente para el PUT final en code-second
      this.profileUpdate.setPendingEmail(this.form.value.email);
      this.router.navigate(['/admin/change-email/code-first']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  return() {
    this.router.navigate(['/admin/informacion']);
  }
}
