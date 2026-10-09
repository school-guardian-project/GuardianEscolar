import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarAdmin } from '@shared/components/navbar/sidebar-admin/sidebar-admin';
import { SidebarSuperadmin } from '@shared/components/navbar/sidebar-superadmin/sidebar-superadmin';
import { Themes } from '@shared/components/modal/themes/themes';
import { Language } from '@shared/components/modal/language/language'
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { AuthService, ROLES } from '@core/services/auth.service';
import { ProfileService, UserProfileDto } from '@core/services/profile.service';
import { AdminsService } from '@features/superadmin/admins/services/admins.service';
import { AdminResponseDto } from '@features/superadmin/admins/models/admin.model';
import { finalize, map, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-information-admin',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SidebarAdmin,
    SidebarSuperadmin,
    NavbarManage,
    Themes,
    Language,
    TranslateModule,
    NgIf
  ],
  templateUrl: './information-admin.html',
  styleUrls: ['./information-admin.css'],
})
export class InformationAdmin implements OnInit {

  changeTheme = false;
  changeLanguage = false;
  loading = false;
  loadFailed = false;

  imageUrl: string | ArrayBuffer | null = null;

  user: AdminResponseDto | null = null;
  profile: UserProfileDto | null = null;
  loading = false;
  loadFailed = false;

  get isSuperAdmin(): boolean {
    return this.authService.roleId === ROLES.SUPER_ADMIN;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminsService: AdminsService,
    private profileService: ProfileService,
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.loadFailed = false;

    this.profileService.getProfile().pipe(
      switchMap((profile) => {
        this.profile = profile;
        if (!profile?.personId) {
          return throwError(() => new Error('The authenticated profile has no person ID.'));
        }
        return this.adminsService.get(profile.personId).pipe(
          map((user) => {
            if (!user) {
              throw new Error('The profile person details were not found.');
            }
            return user;
          }),
        );
      }),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error: unknown) => {
        console.error('Could not load the authenticated admin profile:', error);
        this.loadFailed = true;
      },
    });
  }

  get name(): string {
    return `${this.user?.name ?? this.profile?.name ?? ''} ${this.user?.lastName ?? this.profile?.lastName ?? ''}`.trim();
  }

  get roleKey(): string {
    return this.authService.roleId === ROLES.SUPER_ADMIN
      ? 'admin_profile.user.role_superadmin'
      : 'admin_profile.user.role';
  }

  get id(): string {
    return this.user?.identificationNumber ?? '';
  }

  get email(): string {
    return this.user?.email ?? this.profile?.email ?? this.authService.session.email ?? '';
  }

  get phone(): string {
    return this.user?.phone != null ? String(this.user.phone) : '';
  }

  get address(): string {
    return this.user?.residenceAddress ?? '';
  }

  get dateBirth(): string {
    return this.user?.dateBirth?.split('T')[0] ?? '';
  }

  get city(): string {
    return this.profile?.cityName ?? '';
  }

  get school(): string {
    return this.profile?.schoolName ?? '';
  }

  /**
   * La contraseña nunca sale del backend (solo su hash bcrypt): aquí se
   * muestra una máscara fija de puntos, igual que cualquier perfil.
   */
  get passwordMask(): string {
    return '··········';
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

  changePassword() {
    this.router.navigate(['admin/change-password/email']);
  }

  changeContact() {
    this.router.navigate(['admin/change-contact/telephone']);
  }
}