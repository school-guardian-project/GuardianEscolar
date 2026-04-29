import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';
import { SidebarSuperadmin } from '../../../../../shared/components/navbar/sidebar-superadmin/sidebar-superadmin';
import { RecordInformation, RecordData } from '../../../../../shared/components/modal/record-information/record-information';

@Component({
  selector: 'app-admins',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NavbarManage,
    CardRegister,
    CardList,
    SidebarSuperadmin,
    RecordInformation,
  ],
  templateUrl: './admins.html',
  styleUrl: './admins.css',
})
export class Admins {
  showModal = false;
  adminSelected: RecordData = {};

  showDetails(admin: RecordData): void {
    this.adminSelected = admin;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.adminSelected = {};
  }
}
