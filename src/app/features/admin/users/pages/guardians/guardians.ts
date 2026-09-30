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
import { ParentsService } from '@core/services/parents.service';

@Component({
  selector: 'app-guardians',
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
  templateUrl: './guardians.html',
  styleUrl: './guardians.scss',
})
export class Guardians {
  private parentsService = inject(ParentsService);

  showModal = false;
  showUpdateModal = false;
  showDeleteModal = false;
  attendantSelected: RecordData = {};

  showDetails(attendant: RecordData): void {
    this.attendantSelected = attendant;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.attendantSelected = {};
  }

  showUpdate(attendant: RecordData): void {
    this.attendantSelected = attendant;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.attendantSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    this.parentsService.update(updatedRecord.id, updatedRecord).subscribe(() => {
      this.closeUpdateModal();
    });
  }

  showDelete(attendant: RecordData): void {
    this.attendantSelected = attendant;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.attendantSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    this.parentsService.remove(record.id).subscribe(() => {
      this.closeDeleteModal();
    });
  }
}
