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
import { ParentsService } from '@core/services/parents.service';
import { PersonListDto, PersonRequestDto, CreatePersonRequestDto, PersonResponseDto } from '@core/models/student.model';
import { describeProblem } from '@core/http/problem-detail';

interface GuardianView extends RecordData {
  id?: string;
  names: string;
  lastNames: string;
  name: string;
  identification: string;
  phone: string;
  documentType?: string;
  birthDate?: string;
  address?: string;
  email?: string;
}

function fromApi(api: PersonListDto): GuardianView {
  const names = api.name ?? '';
  const lastNames = api.lastName ?? '';
  return {
    id: api.id,
    names,
    lastNames,
    name: `${names} ${lastNames}`.trim(),
    identification: api.identificationNumber ?? '',
    phone: api.phone != null ? String(api.phone) : '',
  };
}

const IDENTIFICATION_LABELS = ['TI', 'CC'];

function fromDetail(api: PersonResponseDto): GuardianView {
  return {
    ...fromApi(api),
    documentType: IDENTIFICATION_LABELS[api.identificationType] ?? '',
    birthDate: api.dateBirth ?? '',
    address: api.residenceAddress ?? '',
    email: api.email ?? '',
  };
}

function toPayload(form: RecordData): PersonRequestDto {
  const digits = String(form['phone'] ?? '').replace(/\D/g, '');
  return {
    name: String(form['names'] ?? '').trim(),
    lastName: String(form['lastNames'] ?? '').trim(),
    identificationType: String(form['documentType'] ?? '').trim(),
    identificationNumber: String(form['identification'] ?? '').trim(),
    email: String(form['email'] ?? '').trim(),
    phone: Number(digits),
    residenceAddress: String(form['address'] ?? '').trim(),
    dateBirth: String(form['birthDate'] ?? '').trim(),
  };
}

/**
 * El payload del POST lleva la sede (campusId). Se separa de {@link toPayload}
 * porque el PUT no la acepta: mandarla en el update no tendría efecto y, peor,
 * sugeriría que ahí se cambia la sede cuando es un traslado.
 */
function toCreatePayload(form: RecordData): CreatePersonRequestDto {
  return {
    ...toPayload(form),
    campusId: String(form['campus'] ?? '').trim(),
  };
}

@Component({
  selector: 'app-guardians',
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
  templateUrl: './guardians.html',
  styleUrl: './guardians.scss',
})
export class Guardians implements OnInit {
  private parentsService = inject(ParentsService);

  @ViewChild(CardRegister) register?: CardRegister;

  guardians = signal<GuardianView[]>([]);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.parentsService.list().subscribe({
      next: (list) => this.guardians.set(list.map(fromApi)),
    });
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.parentsService.search(query).subscribe({
      next: (list) => this.guardians.set(list.map(fromApi)),
    });
  }

  onCreated(form: RecordData): void {
    this.parentsService.create(toCreatePayload(form)).subscribe({
      next: () => {
        this.register?.setValidationMessage('');
        this.register?.resetForm();
        this.load();
      },
      error: (err) => {
        this.register?.setValidationMessage(
          describeProblem(err, 'No se pudo registrar el acudiente. Verifica que el backend esté disponible.')
        );
      },
    });
  }

  showModal = false;
  attendantSelected: RecordData = {};

  showDetails(attendant: RecordData): void {
    const id = attendant['id'];
    if (!id) return;
    this.parentsService.get(String(id)).subscribe({
      next: (detail) => {
        this.attendantSelected = fromDetail(detail);
        this.showModal = true;
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.attendantSelected = {};
  }

  showUpdateModal = false;

  showUpdate(attendant: RecordData): void {
    const id = attendant['id'];
    if (!id) return;
    this.parentsService.get(String(id)).subscribe({
      next: (detail) => {
        this.attendantSelected = fromDetail(detail);
        this.showUpdateModal = true;
      },
    });
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.attendantSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }

    this.parentsService.update(String(id), toPayload(updatedRecord)).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
    });
  }

  showDeleteModal = false;

  showDelete(attendant: RecordData): void {
    if (!attendant['id']) return;
    this.attendantSelected = attendant;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.attendantSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.parentsService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
    });
  }
}
