import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { Comments } from '@shared/components/modal/comments/comments';
import { UpdateInformation } from '@shared/components/modal/update-information/update-information';
import { SidebarAdmin } from '@shared/components/navbar/sidebar-admin/sidebar-admin';
import {  RecordInformation,  RecordData} from '@shared/components/modal/record-information/record-information';
import { AuthService } from '@core/services/auth.service';
import { SchoolsService } from '@core/services/schools.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    NavbarManage,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    Comments,
    UpdateInformation,
    SidebarAdmin,
    RecordInformation,
    TranslateModule
  ],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.scss']
})
export class DashboardAdmin {
  showComments = false;
  showUpdateInformation = false;
  showInformation = false;

  schoolSelected: RecordData = {};
  loadingSchool = false;
  schoolErrorKey = '';

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly schoolsService: SchoolsService,
  ) { }

  get schoolId(): string | null {
    return this.authService.session.schoolId;
  }

  navegarUsuarios(): void {
    this.router.navigate(['/dashboard-admin/usuarios']);
  }

  isChildRouteActive(): boolean {
    return this.router.url !== '/dashboard-admin';
  }

  showDetails(): void {
    if (this.loadingSchool) return;
    this.schoolErrorKey = '';
    this.schoolSelected = {};
    this.showInformation = false;
    const schoolId = this.schoolId;
    if (!schoolId) {
      this.schoolErrorKey = 'dashboard.schoolInformation.noSchool';
      return;
    }

    this.loadingSchool = true;
    this.schoolsService.get(schoolId).subscribe({
      next: (school) => {
        this.schoolSelected = {
          ...school,
          city: school.cityName,
          schooling: school.theme,
        };
        this.loadingSchool = false;
        this.showInformation = true;
      },
      error: (error: unknown) => {
        console.error('No se pudo cargar la escuela asociada al administrador.', error);
        this.loadingSchool = false;
        this.schoolErrorKey = 'dashboard.schoolInformation.loadError';
      },
    });
  }

  closeModal(): void {
    this.showInformation = false;
    this.schoolSelected = {};
  }
}