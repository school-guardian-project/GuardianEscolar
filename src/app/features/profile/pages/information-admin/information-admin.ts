import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarAdmin } from '../../../../shared/components/navbar/sidebar-admin/sidebar-admin';

import { Router } from '@angular/router';
@Component({
  selector: 'app-information-admin',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SidebarAdmin,
  ],
  templateUrl: './information-admin.html',
  styleUrl: './information-admin.css',
})
export class InformationAdmin {
  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/dashboard-admin']);
  }

  imageUrl: string | ArrayBuffer | null = null;

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
