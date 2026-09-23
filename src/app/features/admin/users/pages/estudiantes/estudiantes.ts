import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { StudentsService } from '@core/services/students.service';
import { PersonListDto, PersonRequestDto, PersonResponseDto } from '@core/models/student.model';

interface StudentView extends RecordData {
  id?: string;
  nombres: string;
  apellidos: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  tipoId?: string;
  fechaNac?: string;
  direccion?: string;
  correo?: string;
}

function fromApi(api: PersonListDto): StudentView {
  const nombres = api.name ?? '';
  const apellidos = api.lastName ?? '';
  return {
    id: api.id,
    nombres,
    apellidos,
    nombre: `${nombres} ${apellidos}`.trim(),
    identificacion: api.identificationNumber ?? '',
    telefono: api.phone != null ? String(api.phone) : '',
  };
}

const IDENTIFICATION_LABELS = ['TI', 'CC'];

function fromDetail(api: PersonResponseDto): StudentView {
  return {
    ...fromApi(api),
    tipoId: IDENTIFICATION_LABELS[api.identificationType] ?? '',
    fechaNac: api.dateBirth ?? '',
    direccion: api.residenceAddress ?? '',
    correo: api.email ?? '',
  };
}

function toPayload(form: RecordData): PersonRequestDto {
  const digits = String(form['telefono'] ?? '').replace(/\D/g, '');
  return {
    name: String(form['nombres'] ?? '').trim(),
    lastName: String(form['apellidos'] ?? '').trim(),
    identificationType: String(form['tipoId'] ?? '').trim(),
    identificationNumber: String(form['identificacion'] ?? '').trim(),
    email: String(form['correo'] ?? '').trim(),
    phone: Number(digits),
    residenceAddress: String(form['direccion'] ?? '').trim(),
    dateBirth: String(form['fechaNac'] ?? '').trim(),
  };
}

const REQUIRED_FIELDS = [
  'nombres',
  'apellidos',
  'tipoId',
  'identificacion',
  'fechaNac',
  'telefono',
  'direccion',
  'correo',
] as const;

const MAX_LENGTHS: Record<string, number> = {
  nombres: 50,
  apellidos: 50,
  identificacion: 20,
  correo: 50,
  direccion: 50,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INT_MAX = 2147483647;

function isValidStudentForm(form: RecordData): boolean {
  for (const field of REQUIRED_FIELDS) {
    if (!String(form[field] ?? '').trim()) {
      return false;
    }
  }

  if (!['CC', 'TI'].includes(String(form['tipoId']))) {
    return false;
  }

  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    if (String(form[field] ?? '').length > max) {
      return false;
    }
  }

  if (!EMAIL_PATTERN.test(String(form['correo']))) {
    return false;
  }

  if (!DATE_PATTERN.test(String(form['fechaNac']))) {
    return false;
  }

  const digits = String(form['telefono'] ?? '').replace(/\D/g, '');
  const phone = Number(digits);
  if (!digits || phone < 1 || phone > INT_MAX) {
    return false;
  }

  return true;
}

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
export class Estudiantes implements OnInit {
  private studentsService = inject(StudentsService);

  @ViewChild(CardRegister) register?: CardRegister;

  students = signal<StudentView[]>([]);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.studentsService.list().subscribe({
      next: (list) => this.students.set(list.map(fromApi)),
    });
  }

  onCreated(form: RecordData): void {
    if (!isValidStudentForm(form)) {
      return;
    }

    this.studentsService.create(toPayload(form)).subscribe({
      next: () => {
        this.register?.resetForm();
        this.load();
      },
    });
  }

  showModal = false;
  studentSelected: RecordData = {};

  showDetails(student: RecordData): void {
    const id = student['id'];
    if (!id) {
      return;
    }
    this.studentsService.get(String(id)).subscribe({
      next: (detail) => {
        this.studentSelected = fromDetail(detail);
        this.showModal = true;
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.studentSelected = {};
  }

  showUpdateModal = false;

  showUpdate(student: RecordData): void {
    const id = student['id'];
    if (!id) {
      return;
    }
    this.studentsService.get(String(id)).subscribe({
      next: (detail) => {
        this.studentSelected = fromDetail(detail);
        this.showUpdateModal = true;
      },
    });
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.studentSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }

    if (!isValidStudentForm(updatedRecord)) {
      return;
    }

    this.studentsService.update(String(id), toPayload(updatedRecord)).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
    });
  }

  showDeleteModal = false;

  showDelete(student: RecordData): void {
    if (!student['id']) {
      return;
    }
    this.studentSelected = student;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.studentSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.studentsService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
    });
  }
}
