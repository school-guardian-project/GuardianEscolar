import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarDashboard } from '@shared/components/navbar/navbar-dashboard/navbar-dashboard';
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
    NavbarDashboard,
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
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdmin {
  viewItem: RecordData = {};
  showComments = false;
  showUpdateInformation = false;
  showInformation = false;

  schoolSelected: RecordData = {};

  // dato de prueba
  schoolExample: RecordData = MOCK_DATA.schools?.[0] || {};
  constructor(private router: Router) { }

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