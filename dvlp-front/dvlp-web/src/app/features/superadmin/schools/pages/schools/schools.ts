import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { SidebarSuperadmin } from '@shared/components/navbar/sidebar-superadmin/sidebar-superadmin';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';
import { SchoolsService } from '../../services/schools.service';
import { SchoolListDto, SchoolRequestDto, SchoolResponseDto } from '../../models/school.model';

interface SchoolView extends RecordData {
  id?: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  city?: string;
  schooling?: string;
  status?: string;
}

function fromApi(api: SchoolListDto): SchoolView {
  return {
    id: api.id,
    name: api.name ?? '',
    address: api.address ?? '',
  };
}

function fromDetail(api: SchoolResponseDto): SchoolView {
  return {
    ...fromApi(api),
    phone: api.phone != null ? String(api.phone) : '',
    email: api.email ?? '',
    website: api.website ?? '',
    city: api.cityName ?? '',
    schooling: api.theme ?? '',
    status: api.status ?? '',
  };
}

function toPayload(form: RecordData): SchoolRequestDto {
  const digits = String(form['phone'] ?? '').replace(/\D/g, '');
  return {
    cityId: String(form['city'] ?? '00000000-0000-0000-0000-000000000000'),
    logo: '',
    name: String(form['name'] ?? '').trim(),
    address: String(form['address'] ?? '').trim(),
    phone: Number(digits),
    email: String(form['email'] ?? '').trim(),
    website: String(form['website'] ?? '').trim(),
    theme: String(form['schooling'] ?? '').trim(),
  };
}

@Component({
  selector: 'app-schools',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NavbarManage,
    CardRegister,
    CardList,
    SidebarSuperadmin,
    RecordInformation,
    UpdateRecord,
    DeleteRecord,
  ],
  templateUrl: './schools.html',
  styleUrl: './schools.scss',
})
export class Schools implements OnInit {
  private schoolsService = inject(SchoolsService);

  @ViewChild(CardRegister) register?: CardRegister;

  schools = signal<SchoolView[]>([]);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.schoolsService.list().subscribe({
      next: (list) => this.schools.set(list.map(fromApi)),
    });
  }

  onCreated(form: RecordData): void {
    this.schoolsService.create(toPayload(form)).subscribe({
      next: () => {
        this.register?.setValidationMessage('');
        this.register?.resetForm();
        this.load();
      },
      error: () => {
        this.register?.setValidationMessage(
          'No se pudo registrar la escuela. Verifica que el backend esté disponible.'
        );
      },
    });
  }

  showModal = false;
  schoolSelected: RecordData = {};

  showDetails(school: RecordData): void {
    const id = school['id'];
    if (!id) return;
    this.schoolsService.get(String(id)).subscribe({
      next: (detail) => {
        this.schoolSelected = fromDetail(detail);
        this.showModal = true;
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.schoolSelected = {};
  }

  showUpdateModal = false;

  showUpdate(school: RecordData): void {
    const id = school['id'];
    if (!id) return;
    this.schoolsService.get(String(id)).subscribe({
      next: (detail) => {
        this.schoolSelected = fromDetail(detail);
        this.showUpdateModal = true;
      },
    });
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.schoolSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }

    this.schoolsService.update(String(id), toPayload(updatedRecord)).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
    });
  }

  showDeleteModal = false;

  showDelete(school: RecordData): void {
    if (!school['id']) return;
    this.schoolSelected = school;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.schoolSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.schoolsService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
    });
  }
}
