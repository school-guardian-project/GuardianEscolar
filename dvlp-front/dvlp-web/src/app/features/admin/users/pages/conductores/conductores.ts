import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { NavbarAdmin } from '@shared/components/navbar/navbar-admin/navbar-admin';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';



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
    UpdateRecord,
    DeleteRecord,
  ],
  templateUrl: './conductores.html',
  styleUrl: './conductores.css',
})
export class Conductores {
  showModal = false;
  showUpdateModal = false;
  showDeleteModal = false;
  driverSelected: RecordData = {};

  showDetails(driver: RecordData): void {
    this.driverSelected = driver;
    this.showModal = true;
  }

  showUpdate(driver: RecordData): void {
    this.driverSelected = driver;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.driverSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.driverSelected = {};
  }
  onSaved(updatedRecord: RecordData): void {
    console.log('[Conductores] Datos actualizados:', updatedRecord);
    // this.conductoresService.update(updatedRecord).subscribe(() => { ... });
    this.closeUpdateModal();
  }

  showDelete(driver: RecordData): void {
    this.driverSelected = driver;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.driverSelected = {};
  }

  onConfirmDelete(driver: RecordData): void {
    console.log('[Conductores] Confirmar eliminación:', driver);
    // this.conductoresService.delete(driver).subscribe(() => { ... });
    this.closeDeleteModal();
  }
}
