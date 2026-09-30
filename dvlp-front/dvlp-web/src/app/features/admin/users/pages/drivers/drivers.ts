import { Component, inject } from '@angular/core';
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
import { DriversService } from '@core/services/drivers.service';

@Component({
  selector: 'app-drivers',
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
  templateUrl: './drivers.html',
  styleUrl: './drivers.scss',
})
export class Drivers {
  private driversService = inject(DriversService);

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
    this.driversService.update(updatedRecord.id, updatedRecord).subscribe(() => {
      this.closeUpdateModal();
    });
  }

  showDelete(driver: RecordData): void {
    this.driverSelected = driver;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.driverSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    this.driversService.remove(record.id).subscribe(() => {
      this.closeDeleteModal();
    });
  }
}
