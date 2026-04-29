import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { NavbarAdmin } from '../../../../../shared/components/navbar/navbar-admin/navbar-admin';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';
import { RecordInformation, RecordData } from '../../../../../shared/components/modal/record-information/record-information';
import { UpdateRecord } from '../../../../../shared/components/modal/update-record/update-record';

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
  ],
  templateUrl: './padres.html',
  styleUrl: './padres.css',
})
export class Padres {
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

  showUpdate(student: RecordData): void {
    this.attendantSelected = student;
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
    console.log('[Estudiantes] Datos actualizados:', updatedRecord);
    // this.estudiantesService.update(updatedRecord).subscribe(() => { ... });
    this.closeUpdateModal();
  }
}
