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
  selector: 'app-rutas',
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
  templateUrl: './rutas.html',
  styleUrl: './rutas.scss',
})
export class Rutas {
  private dataService = inject(CardListDataService);
  showModal = false;
  showUpdateModal = false;
  routeSelected: RecordData = {};

  showDetails(route: RecordData): void {
    this.routeSelected = route;
    this.showModal = true;
  }

  showUpdateDetails(bus: RecordData): void {
    this.routeSelected = bus;
    this.showUpdateModal = true;
  }
  closeModal(): void {
    this.showModal = false;
    this.routeSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.routeSelected = {};
  }
  onSaved(updatedRecord: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.update('ruta', this.routeSelected, updatedRecord).subscribe({
        next: () => console.log('[MOCK-API] UPDATE ruta OK', updatedRecord),
        error: (e) => console.warn('[MOCK-API] UPDATE ruta FAIL', e.message),
      });
    } else {
      console.log('[Rutas] Datos actualizados:', updatedRecord);
    }
    this.closeUpdateModal();
  }
    // ── Eliminar registro ───────────────────────────────────────────────────
  showDeleteModal = false;

  showDelete(route: RecordData): void {
    this.routeSelected = route;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.routeSelected = {};
  }

  /**
   * Confirma la eliminación del registro.
   * Aquí puedes llamar a tu servicio para eliminar.
   */
  onConfirmDelete(record: RecordData): void {
    if (this.dataService.isMockEnabled()) {
      this.dataService.delete('ruta', record ?? this.routeSelected).subscribe({
        next: () => console.log('[MOCK-API] DELETE ruta OK', record),
        error: (e) => console.warn('[MOCK-API] DELETE ruta FAIL', e.message),
      });
    } else {
      console.log('[Rutas] Eliminando:', record);
    }
    this.closeDeleteModal();
  }
}
