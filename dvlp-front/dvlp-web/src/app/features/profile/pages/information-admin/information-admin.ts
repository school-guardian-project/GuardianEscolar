import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarAdmin } from '@shared/components/navbar/sidebar-admin/sidebar-admin';
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

@Component({
  selector: 'app-information-admin',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SidebarAdmin,
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

  imageUrl: string | ArrayBuffer | null = null;

  user: AdminResponseDto | null = null;
  profile: UserProfileDto | null = null;
  loading = false;
  loadFailed = false;

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
    this.user = null;
    this.profile = null;

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        if (!profile.personId) {
          this.loading = false;
          this.loadFailed = true;
          return;
        }

        this.adminsService.get(profile.personId).subscribe({
          next: (user) => {
            this.user = user;
            this.loading = false;
            this.loadFailed = !user;
          },
          error: (error: unknown) => {
            console.error('No se pudieron cargar los datos personales del administrador.', error);
            this.loading = false;
            this.loadFailed = true;
          },
        });
      },
      error: (error: unknown) => {
        console.error('No se pudo cargar el perfil autenticado.', error);
        this.loading = false;
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