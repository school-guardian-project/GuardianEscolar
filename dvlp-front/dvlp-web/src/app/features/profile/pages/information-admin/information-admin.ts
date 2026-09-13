import { Component, OnInit, inject } from '@angular/core';
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
import { MockApiService } from '@core/api-mock/mock-api.service';
import { ProfileUpdateService } from '@core/api-mock/profile-update.service';

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
  private api = inject(MockApiService);
  private router = inject(Router);

  // Datos reales desde db.json vía sesión
  user: any = null;
  person: any = null;
  school: any = null;
  loading = true;

  // Fallback para que nunca quede en blanco (datos quemados previos)
  private fallbackUser = { name: 'Carlos Andrés Pérez Gómez', email: 'admin1@colegio.edu.co', phone: 310555100, address: 'Calle 10 #8-20', id: '900000001', birth: '1985-03-15' };
  private fallbackSchool = { Name: 'Colegio Técnico Neiva', Address: 'Calle 55 #20-40' };

  private profileUpdate = inject(ProfileUpdateService);

  ngOnInit(): void {
    this.loadProfile();
    // [MOCK-API] refresca sin recargar página cuando se cambia email/teléfono
    this.profileUpdate.refresh$.subscribe(() => {
      // Actualiza visual al instante con el valor de localStorage antes de refetch
      const freshEmail = localStorage.getItem('user_email');
      if (freshEmail && this.user) this.user = { ...this.user, email: freshEmail };
      // También actualiza phone si cambió (lo leemos del pending)
      this.loadProfile();
    });
    // También recarga cuando se vuelve a la ruta (sin F5) — Angular reutiliza el componente
    this.router.events.subscribe((e: any) => {
      if (e?.urlAfterRedirects?.includes('/admin/informacion') || e?.url?.includes('/admin/informacion')) {
        this.loadProfile();
      }
    });
  }

  private loadProfile(): void {
    const email = localStorage.getItem('user_email') || 'admin1@colegio.edu.co';
    // [MOCK-API] Cliente -> :3000 -> DB — con fallback para no dejar en blanco
    this.api.get<any[]>('/persons', { Email: email }).subscribe({
      next: (persons) => {
        const p = persons[0] ?? null;
        if (!p) {
          this.person = this.fallbackUser as any;
          this.user = this.fallbackUser;
          this.school = this.fallbackSchool;
          this.loading = false;
          return;
        }
        this.person = p;
        this.user = { name: `${p.Name} ${p.LastName}`, email: p.Email, phone: p.Phone, address: p.ResidenceAddress, id: p.IdentificationNumber, birth: p.DateBirth };
        this.api.get<any[]>('/profiles', { PersonId: p.Id }).subscribe({
          next: (profiles) => {
            const prof = profiles[0];
            if (!prof) { this.school = this.fallbackSchool; this.loading = false; return; }
            this.api.get<any[]>('/school-campuses', { Id: prof.CampuseId }).subscribe({
              next: (campuses) => {
                const camp = campuses[0];
                const schoolId = camp?.SchoolId || 'school-0001-0000-0000-000000000000';
                this.api.get<any[]>('/schools', { Id: schoolId }).subscribe({
                  next: (schools) => { this.school = schools[0] ?? this.fallbackSchool; this.loading = false; },
                  error: () => { this.school = this.fallbackSchool; this.loading = false; },
                });
              },
              error: () => { this.school = this.fallbackSchool; this.loading = false; },
            });
          },
          error: () => { this.school = this.fallbackSchool; this.loading = false; },
        });
      },
      error: () => {
        this.person = this.fallbackUser as any;
        this.user = this.fallbackUser;
        this.school = this.fallbackSchool;
        this.loading = false;
      },
    });
  }

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

  changePassword() {
    this.router.navigate(['admin/change-password/email']);
  }

  changeContact() {
    this.router.navigate(['admin/change-contact/telephone']);
  }
}