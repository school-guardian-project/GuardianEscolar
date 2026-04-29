import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';
import { NavbarAdmin } from '../../../../../shared/components/navbar/navbar-admin/navbar-admin';
import { RecordInformation, RecordData } from '../../../../../shared/components/modal/record-information/record-information';


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
  ],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
})
export class Estudiantes {
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
}