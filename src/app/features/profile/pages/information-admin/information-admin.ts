import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarAdmin } from '../../../../shared/components/navbar/sidebar-admin/sidebar-admin';
import { Themes } from '../../../../shared/components/modal/themes/themes';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common'; 
import { NavbarManage } from '../../../../shared/components/navbar/navbar-manage/navbar-manage';

@Component({
  selector: 'app-information-admin',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SidebarAdmin,
    Themes,
    NgIf,
    NavbarManage,
  ],
  templateUrl: './information-admin.html',
  styleUrls: ['./information-admin.css'],
})
export class InformationAdmin {

  changeTheme = false;
  changeLanguage = false;

  imageUrl: string | ArrayBuffer | null = null;

  constructor(private router: Router) { }

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
