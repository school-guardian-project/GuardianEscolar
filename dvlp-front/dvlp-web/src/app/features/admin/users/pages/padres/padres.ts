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
  selector: 'app-padres',
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
  templateUrl: './padres.html',
  styleUrl: './padres.scss',
})
export class Padres {
  private dataService = inject(CardListDataService);
  showModal = false;
  attendantSelected: RecordData = {};

  showDetails(attendant: RecordData): void {
    this.attendantSelected = attendant;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.attendantSelected = {};
  }

  showUpdateModal = false;

  showUpdate(attendant: RecordData): void {
    this.attendantSelected = attendant;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.attendantSelected = {};
  }

  /**
   * Recibe los datos ya actualizados del formulario.
   * Aquí puedes llamar a tu servicio para persistirlos.
   */
  onSaved(updatedRecord: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.update('acudiente', this.attendantSelected, updatedRecord).subscribe({
        next: () => console.log('[MOCK-API] UPDATE acudiente OK', updatedRecord),
        error: (e) => console.warn('[MOCK-API] UPDATE acudiente FAIL', e.message),
      });
    } else {
      console.log('[Acudientes] Datos actualizados:', updatedRecord);
    }
    this.closeUpdateModal();
  }
    showDeleteModal = false;

  showDelete(attendant: RecordData): void {
    this.attendantSelected = attendant;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.attendantSelected = {};
  }

  /**
   * Confirma la eliminación del registro.
   * Aquí puedes llamar a tu servicio para eliminar.
   */
  onConfirmDelete(record: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.delete('acudiente', record ?? this.attendantSelected).subscribe({
        next: () => console.log('[MOCK-API] DELETE acudiente OK', record),
        error: (e) => console.warn('[MOCK-API] DELETE acudiente FAIL', e.message),
      });
    } else {
      console.log('[Acudientes] Eliminando:', record);
    }
    this.closeDeleteModal();
  }
}
