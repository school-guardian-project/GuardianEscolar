import { Component } from '@angular/core';
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
  styleUrl: './rutas.css',
})
export class Rutas {
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
    console.log('[Rutas] Datos actualizados:', updatedRecord);
    // this.rutasService.update(updatedRecord).subscribe(() => { ... });
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
    console.log('[Rutas] Eliminando:', record);
    // this.rutasService.delete(record.id).subscribe(() => { ... });
    this.closeDeleteModal();
  }
}
