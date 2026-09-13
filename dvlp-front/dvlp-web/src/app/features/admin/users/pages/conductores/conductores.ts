import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListDataService } from '@core/api-mock/card-list.data.service';
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
  styleUrl: './conductores.scss',
})
export class Conductores {
  private dataService = inject(CardListDataService);
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
    if (this.dataService.isMockEnabled()) {
      this.dataService.update('conductor', this.driverSelected, updatedRecord).subscribe({
        next: () => console.log('[MOCK-API] UPDATE conductor OK', updatedRecord),
        error: (e) => console.warn('[MOCK-API] UPDATE conductor FAIL', e.message),
      });
    } else {
      console.log('[Conductores] Datos actualizados:', updatedRecord);
    }
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
    if (this.dataService.isMockEnabled()) {
      this.dataService.delete('conductor', driver ?? this.driverSelected).subscribe({
        next: () => console.log('[MOCK-API] DELETE conductor OK', driver),
        error: (e) => console.warn('[MOCK-API] DELETE conductor FAIL', e.message),
      });
    } else {
      console.log('[Conductores] Confirmar eliminación:', driver);
    }
    this.closeDeleteModal();
  }
}
