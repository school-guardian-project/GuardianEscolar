import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { NavbarAdmin } from '../../../../../shared/components/navbar/navbar-admin/navbar-admin';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';
import { RecordInformation, RecordData } from '../../../../../shared/components/modal/record-information/record-information';

@Component({
  selector: 'app-conductores',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NavbarManage,
    CardRegister,
    CardList,
    NavbarAdmin,
    RecordInformation,
  ],
  templateUrl: './conductores.html',
  styleUrl: './conductores.css',
})
export class Conductores {
  showModal = false;
  driverSelected: RecordData = {};

  showDetails(driver: RecordData): void {
    this.driverSelected = driver;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.driverSelected = {};
  }
}
