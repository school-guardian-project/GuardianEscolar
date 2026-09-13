import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MockApiService } from '@core/api-mock/mock-api.service';
import { ProfileUpdateService } from '@core/api-mock/profile-update.service';
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

import { CardType } from '@shared/components/cards/card-list/card-list';

const MOCK_DATA: Partial<Record<CardType, RecordData[]>> = {
  schools: [
    {
      nombre: 'Colegio Técnico Neiva',
      direccion: 'Calle 50 #20-30',
      ciudad: 'Neiva',
      escolaridad: 'Primaria y Bachillerato',
      telefono: '+57 8 876 5432',
      correo: 'info@colegiotecnico.edu.co',
      web: 'www.colegiotecnico.edu.co'
    }
  ]
};

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
export class DashboardAdmin implements OnInit {
  viewItem: RecordData = {};
  showComments = false;
  showUpdateInformation = false;
  showInformation = false;

  schoolSelected: RecordData = {};

  // [MOCK-API] reemplaza MOCK_DATA por db.json real según sesión
  schoolExample: RecordData = MOCK_DATA.schools?.[0] || {};
  private api = inject(MockApiService);
  private profileUpdate = inject(ProfileUpdateService);

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadSchool();
    this.profileUpdate.refresh$.subscribe(() => this.loadSchool());
  }

  private loadSchool(): void {
    // Intenta cargar escuela real de la sesión (admin -> campus -> school)
    const email = localStorage.getItem('user_email') || 'admin1@colegio.edu.co';
    this.api.get<any[]>('/persons', { Email: email }).subscribe({
      next: (persons) => {
        const p = persons[0];
        if (!p) return;
        this.api.get<any[]>('/profiles', { PersonId: p.Id }).subscribe({
          next: (profiles) => {
            const prof = profiles[0];
            if (!prof) return;
            this.api.get<any[]>('/school-campuses', { Id: prof.CampuseId }).subscribe({
              next: (campuses) => {
                const camp = campuses[0];
                const schoolId = camp?.SchoolId || 'school-0001-0000-0000-000000000000';
                this.api.get<any[]>('/schools', { Id: schoolId }).subscribe({
                  next: (schools) => {
                    const s = schools[0];
                    if (s) {
                      this.schoolExample = { nombre: s.Name, direccion: s.Address, ciudad: 'Neiva', telefono: String(s.Phone), correo: s.Email, web: s.Website, escolaridad: '—' };
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  navegarUsuarios(): void {
    this.router.navigate(['/dashboard-admin/usuarios']);
  }

  isChildRouteActive(): boolean {
    return this.router.url !== '/dashboard-admin';
  }

  showDetails(item: RecordData): void {
    this.schoolSelected = item;
    this.viewItem = item;
    this.showInformation = true;
  }

  closeModal(): void {
    this.showInformation = false;
    this.schoolSelected = {};
    this.viewItem = {};
  }
}