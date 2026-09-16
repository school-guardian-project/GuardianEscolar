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
    UpdateRecord,
    DeleteRecord,
  ],
  templateUrl: './admins.html',
  styleUrl: './admins.scss',
})
export class Admins {
  private dataService = inject(CardListDataService);

  showModal = false;
  showUpdateModal = false;
  adminSelected: RecordData = {};

  showDetails(admin: RecordData): void {
    this.adminSelected = admin;
    this.showModal = true;
  }

  showUpdate(admin: RecordData): void {
    this.adminSelected = admin;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showUpdateModal = false;
    this.adminSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.adminSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.update('admins', this.adminSelected, updatedRecord).subscribe({
        next: () => console.log('[MOCK-API] UPDATE admins OK', updatedRecord),
        error: (e) => console.warn('[MOCK-API] UPDATE admins FAIL', e.message),
      });
    } else {
      console.log('[Admins] Datos actualizados:', updatedRecord);
    }
    this.closeUpdateModal();
  }
   showDeleteModal = false;

  showDelete(admin: RecordData): void {
    this.adminSelected = admin;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.adminSelected = {};
  }

  /**
   * Confirma la eliminación del registro.
   * Aquí puedes llamar a tu servicio para eliminar.
   */
  onConfirmDelete(record: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.delete('admins', record ?? this.adminSelected).subscribe({
        next: () => console.log('[MOCK-API] DELETE admins OK', record),
        error: (e) => console.warn('[MOCK-API] DELETE admins FAIL', e.message),
      });
    } else {
      console.log('[Admins] Eliminando:', record);
    }
    this.closeDeleteModal();
  }
}
