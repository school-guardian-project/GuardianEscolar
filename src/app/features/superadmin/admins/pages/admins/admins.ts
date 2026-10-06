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
import { AdminsService } from '../../services/admins.service';
import { AdminListDto, AdminRequestDto, CreateAdminRequestDto, AdminResponseDto } from '../../models/admin.model';
import { describeProblem } from '@core/http/problem-detail';

interface AdminView extends RecordData {
  id?: string;
  name: string;
  lastName: string;
  identification: string;
  phone: string;
  email?: string;
  address?: string;
  birthDate?: string;
}

function fromApi(api: AdminListDto): AdminView {
  return {
    id: api.id,
    name: api.name ?? '',
    lastName: api.lastName ?? '',
    identification: api.identificationNumber ?? '',
    phone: api.phone != null ? String(api.phone) : '',
    email: api.email ?? '',
  };
}

function fromDetail(api: AdminResponseDto): AdminView {
  return {
    ...fromApi(api),
    email: api.email ?? '',
    address: api.residenceAddress ?? '',
    birthDate: api.dateBirth ?? '',
  };
}

function toPayload(form: RecordData): AdminRequestDto {
  const digits = String(form['phone'] ?? '').replace(/\D/g, '');
  return {
    name: String(form['name'] ?? '').trim(),
    lastName: String(form['lastNames'] ?? '').trim(),
    identificationType: 'CC',
    identificationNumber: String(form['identification'] ?? '').trim(),
    email: String(form['email'] ?? '').trim(),
    phone: Number(digits),
    residenceAddress: String(form['address'] ?? '').trim(),
    dateBirth: String(form['birthDate'] ?? '').trim(),
  };
}

/**
 * El alta lleva el colegio que el admin va a administrar (schoolId), y no una
 * sede: su relación vive en School.SchoolAdmin. Solo va en el POST; el PUT usa
 * {@link toPayload}.
 */
function toCreatePayload(form: RecordData): CreateAdminRequestDto {
  return {
    ...toPayload(form),
    schoolId: String(form['school'] ?? '').trim(),
  };
}

@Component({
  selector: 'app-admins',
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
  templateUrl: './admins.html',
  styleUrl: './admins.scss',
})
export class Admins implements OnInit {
  private adminsService = inject(AdminsService);

  @ViewChild(CardRegister) register?: CardRegister;

  admins = signal<AdminView[]>([]);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.adminsService.list().subscribe({
      next: (list) => this.admins.set(list.map(fromApi)),
    });
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.adminsService.search(query).subscribe({
      next: (list) => this.admins.set(list.map(fromApi)),
    });
  }

  onCreated(form: RecordData): void {
    this.adminsService.create(toCreatePayload(form)).subscribe({
      next: () => {
        this.register?.setValidationMessage('');
        this.register?.resetForm();
        this.load();
      },
      error: (err) => {
        this.register?.setValidationMessage(
          describeProblem(err, 'No se pudo registrar el administrador. Verifica que el backend esté disponible.')
        );
      },
    });
  }

  showModal = false;
  adminSelected: RecordData = {};

  showDetails(admin: RecordData): void {
    const id = admin['id'];
    if (!id) return;
    this.adminsService.get(String(id)).subscribe({
      next: (detail) => {
        this.adminSelected = fromDetail(detail);
        this.showModal = true;
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.adminSelected = {};
  }

  showUpdateModal = false;

  showUpdate(admin: RecordData): void {
    const id = admin['id'];
    if (!id) return;
    this.adminsService.get(String(id)).subscribe({
      next: (detail) => {
        this.adminSelected = fromDetail(detail);
        this.showUpdateModal = true;
      },
    });
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.adminSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }

    this.adminsService.update(String(id), toPayload(updatedRecord)).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
    });
  }

  showDeleteModal = false;

  showDelete(admin: RecordData): void {
    if (!admin['id']) return;
    this.adminSelected = admin;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.adminSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.adminsService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
    });
  }
}
