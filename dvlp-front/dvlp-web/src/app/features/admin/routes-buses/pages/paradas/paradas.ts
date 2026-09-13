import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListDataService } from '@core/api-mock/card-list.data.service';
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


@Component({
  selector: 'app-paradas',
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
  templateUrl: './paradas.html',
  styleUrl: './paradas.scss',
})
export class Paradas {
  private dataService = inject(CardListDataService);
  showModal = false;
  showUpdateModal = false;
  stopSelected: RecordData = {};

  showDetails(stop: RecordData): void {
    this.stopSelected = stop;
    this.showModal = true;
  }

  showUpdateDetails(bus: RecordData): void {
    this.stopSelected = bus;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.stopSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.stopSelected = {};
  }
  onSaved(updatedRecord: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.update('parada', this.stopSelected, updatedRecord).subscribe({
        next: () => console.log('[MOCK-API] UPDATE parada OK', updatedRecord),
        error: (e) => console.warn('[MOCK-API] UPDATE parada FAIL', e.message),
      });
    } else {
      console.log('[Paradas] Datos actualizados:', updatedRecord);
    }
    this.closeUpdateModal();
  }
    // ── Eliminar registro ───────────────────────────────────────────────────
  showDeleteModal = false;

  showDelete(stop: RecordData): void {
    this.stopSelected = stop;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.stopSelected = {};
  }

  /**
   * Confirma la eliminación del registro.
   * Aquí puedes llamar a tu servicio para eliminar.
   */
  onConfirmDelete(record: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.delete('parada', record ?? this.stopSelected).subscribe({
        next: () => console.log('[MOCK-API] DELETE parada OK', record),
        error: (e) => console.warn('[MOCK-API] DELETE parada FAIL', e.message),
      });
    } else {
      console.log('[Paradas] Eliminando:', record);
    }
    this.closeDeleteModal();
  }
}
