import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarAdmin } from '@shared/components/navbar/sidebar-admin/sidebar-admin';
import { Themes } from '@shared/components/modal/themes/themes';
import { Language } from '@shared/components/modal/language/language'
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-information-admin',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SidebarAdmin,
    Themes,
    Language,
    TranslateModule,
    NgIf
  ],
  templateUrl: './information-admin.html',
  styleUrls: ['./information-admin.css'],
})
export class InformationAdmin {

  changeTheme = false;
  changeLanguage = false;

  imageUrl: string | ArrayBuffer | null = null;

  constructor(private router: Router) { }

  logout() {
    this.router.navigate(['/dashboard-admin']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  changeEmail() {
    this.router.navigate(['admin/change-email/email']);
  }
}