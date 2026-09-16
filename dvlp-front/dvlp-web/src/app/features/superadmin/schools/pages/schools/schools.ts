import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { SidebarSuperadmin } from '@shared/components/navbar/sidebar-superadmin/sidebar-superadmin';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';
import { CardListDataService } from '@core/api-mock/card-list.data.service';


@Component({
  selector: 'app-schools',
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
    UpdateRecord,
    DeleteRecord,
  ],
  templateUrl: './schools.html',
  styleUrl: './schools.scss',
})
export class Schools {
  private dataService = inject(CardListDataService);

  showModal = false;
  showUpdateModal = false;
  schoolSelected: RecordData = {};

  showDetails(school: RecordData): void {
    this.schoolSelected = school;
    this.showModal = true;
  }

  showUpdate(school: RecordData): void {
    this.schoolSelected = school;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showUpdateModal = false;
    this.schoolSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.schoolSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.update('schools', this.schoolSelected, updatedRecord).subscribe({
        next: () => console.log('[MOCK-API] UPDATE schools OK', updatedRecord),
        error: (e) => console.warn('[MOCK-API] UPDATE schools FAIL', e.message),
      });
    } else {
      console.log('[Schools] Datos actualizados:', updatedRecord);
    }
    this.closeUpdateModal();
  }
   showDeleteModal = false;

  showDelete(school: RecordData): void {
    this.schoolSelected = school;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.schoolSelected = {};
  }

  /**
   * Confirma la eliminación del registro.
   * Aquí puedes llamar a tu servicio para eliminar.
   */
  onConfirmDelete(record: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.delete('schools', record ?? this.schoolSelected).subscribe({
        next: () => console.log('[MOCK-API] DELETE schools OK', record),
        error: (e) => console.warn('[MOCK-API] DELETE schools FAIL', e.message),
      });
    } else {
      console.log('[Schools] Eliminando:', record);
    }
    this.closeDeleteModal();
  }
}
