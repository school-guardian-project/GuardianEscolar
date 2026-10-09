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
import { ProfileService } from '@core/services/profile.service';
import { map, of, switchMap } from 'rxjs';

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
  schoolIdForUpdate: string | null = null;
  loadingSchool = false;
  schoolErrorKey = '';

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly schoolsService: SchoolsService,
    private readonly profileService: ProfileService,
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
    this.loadingSchool = true;
    this.profileService.getProfile().pipe(
      map((profile) => this.resolveSchoolId(profile.schoolId)),
      switchMap((schoolId) => schoolId ? this.schoolsService.get(schoolId) : of(null)),
    ).subscribe({
      next: (school) => {
        if (!school) {
          this.schoolErrorKey = 'dashboard.schoolInformation.noSchool';
          this.loadingSchool = false;
          return;
        }
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

  openSchoolUpdate(): void {
    if (this.loadingSchool) return;
    this.schoolErrorKey = '';
    this.loadingSchool = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.schoolIdForUpdate = this.resolveSchoolId(profile.schoolId);
        this.loadingSchool = false;
        if (!this.schoolIdForUpdate) {
          this.schoolErrorKey = 'dashboard.schoolInformation.noSchool';
          return;
        }
        this.showUpdateInformation = true;
      },
      error: (error: unknown) => {
        console.error('No se pudo obtener el colegio asociado antes de actualizarlo.', error);
        this.loadingSchool = false;
        this.schoolErrorKey = 'dashboard.schoolInformation.loadError';
      },
    });
  }

  private resolveSchoolId(profileSchoolId: string | null | undefined): string | null {
    const schoolId = profileSchoolId === undefined ? this.authService.session.schoolId : profileSchoolId;
    this.authService.updateSessionSchoolId(schoolId ?? null);
    this.schoolIdForUpdate = schoolId ?? null;
    return this.schoolIdForUpdate;
  }

  closeModal(): void {
    this.showInformation = false;
    this.schoolSelected = {};
  }
}