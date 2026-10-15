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
import { CitiesService } from '@core/services/cities.service';
import { SchoolsService } from '@core/services/schools.service';
import { CityListDto } from '@core/models/city.model';
import { SchoolListDto } from '@core/models/school.model';
import { forkJoin } from 'rxjs';

interface AdminView extends RecordData {
  id?: string;
  name: string;
  lastName: string;
  identification: string;
  phone: string;
  email?: string;
  address?: string;
  birthDate?: string;
  city?: string;
  school?: string;
  cityName?: string;
  schoolName?: string;
  cityId?: string | null;
  schoolId?: string | null;
}

function fromApi(api: AdminListDto): AdminView {
  return {
    id: api.id,
    name: api.name ?? '',
    lastName: api.lastName ?? '',
    lastNames: api.lastName ?? '',
    identification: api.identificationNumber ?? '',
    phone: api.phone != null ? String(api.phone) : '',
    email: api.email ?? '',
    cityId: api.cityId,
    schoolId: api.schoolId,
  };
}

function fromDetail(api: AdminResponseDto): AdminView {
  return {
    ...fromApi(api),
    email: api.email ?? '',
    address: api.residenceAddress ?? '',
    birthDate: api.dateBirth ?? '',
    city: api.cityId ?? '',
    school: api.schoolId ?? '',
    cityId: api.cityId,
    schoolId: api.schoolId,
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
    cityId: String(form['city'] ?? form['cityId'] ?? '').trim(),
    schoolId: String(form['school'] ?? form['schoolId'] ?? '').trim(),
  };
}

/**
 * La ciudad y el colegio se guardan junto con los datos del administrador.
 */
function toCreatePayload(form: RecordData): CreateAdminRequestDto {
  return toPayload(form);
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
  private citiesService = inject(CitiesService);
  private schoolsService = inject(SchoolsService);

  @ViewChild(CardRegister) register?: CardRegister;

  admins = signal<AdminView[]>([]);
  cityOptions: CityListDto[] = [];
  schoolOptions: SchoolListDto[] = [];

  ngOnInit(): void {
    this.load();
    forkJoin({
      cities: this.citiesService.list(),
      schools: this.schoolsService.list(),
    }).subscribe({
      next: ({ cities, schools }) => {
        this.cityOptions = cities;
        this.schoolOptions = schools;
        this.admins.update((admins) => admins.map((admin) => this.withNames(admin)));
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(
          error,
          'No se pudieron cargar las ciudades y colegios de los administradores.'
        );
      },
    });
  }

  private load(): void {
    this.adminsService.list().subscribe({
      next: (list) => this.admins.set(list.map((admin) => this.withNames(fromApi(admin)))),
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudieron cargar los administradores.');
      },
    });
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.adminsService.search(query).subscribe({
      next: (list) => this.admins.set(list.map((admin) => this.withNames(fromApi(admin)))),
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudieron buscar los administradores.');
      },
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
    forkJoin({
      detail: this.adminsService.get(String(id)),
      cities: this.citiesService.list(),
      schools: this.schoolsService.list(),
    }).subscribe({
      next: ({ detail, cities, schools }) => {
        this.cityOptions = cities;
        this.schoolOptions = schools;
        this.adminSelected = this.withNames(fromDetail(detail));
        this.showModal = true;
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo cargar el administrador.');
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
    this.actionError = '';
    forkJoin({
      detail: this.adminsService.get(String(id)),
      cities: this.citiesService.list(),
      schools: this.schoolsService.list(),
    }).subscribe({
      next: ({ detail, cities, schools }) => {
        this.cityOptions = cities;
        this.schoolOptions = schools;
        this.adminSelected = this.withNames(fromDetail(detail));
        this.showUpdateModal = true;
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo cargar el administrador para actualizarlo.');
      },
    });
  }

  closeUpdateModal(): void {
    this.actionError = '';
    this.showUpdateModal = false;
    this.adminSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }

    this.actionError = '';
    this.adminsService.update(String(id), toPayload(updatedRecord)).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo actualizar el administrador.');
      },
    });
  }

  showDeleteModal = false;

  showDelete(admin: RecordData): void {
    if (!admin['id']) return;
    this.actionError = '';
    this.adminSelected = admin;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.actionError = '';
    this.showDeleteModal = false;
    this.adminSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.actionError = '';
    this.adminsService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo eliminar el administrador.');
      },
    });
  }

  actionError = '';

  private withNames(admin: AdminView): AdminView {
    const sameId = (a?: string | null, b?: string | null) =>
      !!a && !!b && a.toLowerCase() === b.toLowerCase();
    const school = this.schoolOptions.find((s) => sameId(s.id, admin.schoolId));
    // Admins antiguos tienen colegio pero no ciudad: sin ella el modal filtra
    // los colegios por ciudad vacía y el colegio asignado se pierde al guardar.
    const cityId = admin.cityId || school?.cityId || null;
    const city = this.cityOptions.find((c) => sameId(c.id, cityId));
    return {
      ...admin,
      cityId: city?.id ?? cityId,
      schoolId: school?.id ?? admin.schoolId,
      ...(admin.city !== undefined ? { city: city?.id ?? cityId ?? '' } : {}),
      ...(admin.school !== undefined ? { school: school?.id ?? admin.schoolId ?? '' } : {}),
      cityName: city?.name ?? '',
      schoolName: school?.name ?? '',
    };
  }
}
