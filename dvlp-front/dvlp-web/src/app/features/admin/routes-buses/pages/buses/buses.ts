import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { NavbarAdmin } from '@shared/components/navbar/navbar-admin/navbar-admin';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';
import { BusesService } from '../../services/buses.service';

@Component({
  selector: 'app-buses',
  imports: [
    RouterModule,
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
  templateUrl: './buses.html',
  styleUrl: './buses.scss',
})
export class Buses {
  private busesService = inject(BusesService);

  showModal = false;
  showUpdateModal = false;
  busSelected: RecordData = {};

  showDetails(bus: RecordData): void {
    this.busSelected = bus;
    this.showModal = true;
  }

  showUpdateDetails(bus: RecordData): void {
    this.busSelected = bus;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.busSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.busSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    this.busesService.update(updatedRecord.id, updatedRecord).subscribe(() => {
      this.closeUpdateModal();
    });
  }

  showDeleteModal = false;

  showDelete(bus: RecordData): void {
    this.busSelected = bus;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.busSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    this.busesService.remove(record.id).subscribe(() => {
      this.closeDeleteModal();
    });
  }
}
