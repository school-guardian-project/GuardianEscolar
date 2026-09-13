// estudiantes.ts — ejemplo de integración con app-update-record
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardListDataService } from '@core/api-mock/card-list.data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { NavbarAdmin } from '@shared/components/navbar/navbar-admin/navbar-admin';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
    NavbarManage,
    CardRegister,
    CardList,
    NavbarAdmin,
    RecordInformation,
    UpdateRecord,
    DeleteRecord,
  ],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.scss',
})
export class Estudiantes {
  private dataService = inject(CardListDataService);

  // ── Ver detalles 
  showModal = false;
  studentSelected: RecordData = {};

  showDetails(student: RecordData): void {
    this.studentSelected = student;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.studentSelected = {};
  }

  // ── Actualizar registro ─────────────────────────────────────────────────
  showUpdateModal = false;

  showUpdate(student: RecordData): void {
    this.studentSelected = student;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.studentSelected = {};
  }

  /**
   * Recibe los datos ya actualizados del formulario.
   * Aquí puedes llamar a tu servicio para persistirlos.
   */
  onSaved(updatedRecord: RecordData): void {
    // [MOCK-API] Cliente -> PUT :3000 -> DB (persons)
    if (this.dataService.isMockEnabled()) {
      this.dataService.update('estudiante', this.studentSelected, updatedRecord).subscribe({
        next: () => console.log('[MOCK-API] UPDATE estudiante OK', updatedRecord),
        error: (e) => console.warn('[MOCK-API] UPDATE estudiante FAIL', e.message),
      });
    } else {
      console.log('[Estudiantes] Datos actualizados:', updatedRecord);
    }
    this.closeUpdateModal();
  }

  // ── Eliminar registro ───────────────────────────────────────────────────
  showDeleteModal = false;

  showDelete(student: RecordData): void {
    this.studentSelected = student;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.studentSelected = {};
  }

  /**
   * Confirma la eliminación del registro.
   * Aquí puedes llamar a tu servicio para eliminar.
   */
  onConfirmDelete(record: RecordData): void {
    // [MOCK-API] Cliente -> DELETE :3000 -> DB
    if (this.dataService.isMockEnabled()) {
      this.dataService.delete('estudiante', record ?? this.studentSelected).subscribe({
        next: () => console.log('[MOCK-API] DELETE estudiante OK', record),
        error: (e) => console.warn('[MOCK-API] DELETE estudiante FAIL', e.message),
      });
    } else {
      console.log('[Estudiantes] Eliminando:', record);
    }
    this.closeDeleteModal();
  }
}