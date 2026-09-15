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
import { catchError, map, of, switchMap } from 'rxjs';

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
  private fallbackUser = { name: 'Carlos Andrés Pérez Gómez', email: 'ejemplo@gmail.com', phone: 310555100, address: 'Calle 10 #8-20', id: '900000001', birth: '1985-03-15' };
  private fallbackSchool = { Name: 'Colegio Técnico Neiva', Address: 'Calle 55 #20-40' };

  private profileUpdate = inject(ProfileUpdateService);
  private profileLoad = 0;

  ngOnInit(): void {
    this.loadProfile();
    // [MOCK-API] refresca sin recargar página cuando se cambia email/teléfono
    this.profileUpdate.refresh$.subscribe(() => {
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
    const requestId = ++this.profileLoad;
    const personId = localStorage.getItem('user_person_id');
    const email = localStorage.getItem('user_email') || 'ejemplo@gmail.com';
    const personRequest = personId
      ? this.api.get<any[]>('/persons', { Id: personId })
      : this.api.get<any[]>('/persons', { Email: email }).pipe(
          switchMap((persons) => persons.length
            ? of(persons)
            : this.api.get<any[]>('/persons', { Email: 'ejemplo@gmail.com' }))
        );
    personRequest.pipe(
      switchMap((persons) => {
        const person = persons[0];
        if (!person) return of({ person: null, user: this.fallbackUser, school: this.fallbackSchool });
        const user = { name: `${person.Name} ${person.LastName}`, email: person.Email, phone: person.Phone, address: person.ResidenceAddress, id: person.IdentificationNumber, birth: person.DateBirth };
        return this.api.get<any[]>('/profiles', { PersonId: person.Id }).pipe(
          switchMap((profiles) => {
            const profile = profiles[0];
            if (!profile) return of({ person, user, school: this.fallbackSchool });
            return this.api.get<any[]>('/school-campuses', { Id: profile.CampuseId }).pipe(
              switchMap((campuses) => {
                const schoolId = campuses[0]?.SchoolId || 'school-0001-0000-0000-000000000000';
                return this.api.get<any[]>('/schools', { Id: schoolId }).pipe(
                  map((schools) => ({ person, user, school: schools[0] ?? this.fallbackSchool }))
                );
              })
            );
          })
        );
      }),
      catchError(() => of({ person: this.fallbackUser, user: this.fallbackUser, school: this.fallbackSchool }))
    ).subscribe(({ person, user, school }) => {
      if (requestId !== this.profileLoad) return;
      this.person = person;
      this.user = user;
      this.school = school;
      this.loading = false;
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