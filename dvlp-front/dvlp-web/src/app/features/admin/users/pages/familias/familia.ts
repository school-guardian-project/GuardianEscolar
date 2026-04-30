import { Component } from '@angular/core';
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



@Component({
  selector: 'app-familia',
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
  templateUrl: './familia.html',
  styleUrl: './familia.css',
})
export class Familia {
  showModal = false;
  showUpdateModal = false;
  familySelected: RecordData = {};

  showDetails(family: RecordData): void {
    this.familySelected = family;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.familySelected = {};
  }
  showUpdate(family: RecordData): void {
    this.familySelected = family;
    this.showUpdateModal = true;
  }
  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.familySelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    console.log('[Familias] Datos actualizados:', updatedRecord);
    // this.familiasService.update(updatedRecord).subscribe(() => { ... });
    this.closeUpdateModal();
  }
    showDeleteModal = false;

  showDelete(family: RecordData): void {
    this.familySelected = family;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.familySelected = {};
  }

  /**
   * Confirma la eliminación del registro.
   * Aquí puedes llamar a tu servicio para eliminar.
   */
  onConfirmDelete(record: RecordData): void {
    console.log('[Familias] Eliminando:', record);
    // this.familiasService.delete(record.id).subscribe(() => { ... });
    this.closeDeleteModal();
  }
}
