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
import { SchoolsService } from '@core/services/schools.service';
import { CampusesService } from '@core/services/campuses.service';
import { CitiesService } from '@core/services/cities.service';
import { CityListDto } from '@core/models/city.model';
import { SchoolCampusRequestDto, SchoolListDto, SchoolRequestDto, SchoolResponseDto, SchoolWithCampusesRequestDto, SchoolWithCampusesResponseDto } from '@core/models/school.model';
import { describeProblem } from '@core/http/problem-detail';
import { forkJoin } from 'rxjs';

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
  logo?: string;
}

function fromApi(api: SchoolListDto): SchoolView {
  return {
    id: api.id,
    name: api.name ?? '',
    address: api.address ?? '',
    latitude: api.latitude ?? null,
    longitude: api.longitude ?? null,
  };
}

function fromDetail(api: SchoolResponseDto): SchoolView {
  return {
    ...fromApi(api),
    phone: api.phone != null ? String(api.phone) : '',
    email: api.email ?? '',
    website: api.website ?? '',
    city: api.cityName ?? '',
    logo: api.logo ?? '',
    schooling: api.theme ?? '',
    status: api.status ?? '',
  };
}

function toCoordinate(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function toCampuses(value: unknown): SchoolCampusRequestDto[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const campus = entry as RecordData;
    const id = String(campus['id'] ?? '').trim();
    return {
      ...(id ? { id } : {}),
      name: String(campus['name'] ?? '').trim(),
      address: String(campus['address'] ?? '').trim(),
      latitude: toCoordinate(campus['latitude']),
      longitude: toCoordinate(campus['longitude']),
    };
  });
}

function toPayload(form: RecordData): SchoolRequestDto {
  const digits = String(form['phone'] ?? '').replace(/\D/g, '');
  return {
    cityId: String(form['city'] ?? ''),
    logo: String(form['logo'] ?? ''),
    name: String(form['name'] ?? '').trim(),
    address: String(form['address'] ?? '').trim(),
    latitude: toCoordinate(form['latitude']),
    longitude: toCoordinate(form['longitude']),
    phone: Number(digits),
    email: String(form['email'] ?? '').trim(),
    website: String(form['website'] ?? '').trim(),
    theme: String(form['schooling'] ?? '').trim(),
  };
}

/**
 * Alta con sedes en una sola llamada atómica. `campuses` viene del bloque
 * dinámico del formulario (ya validado ahí: al menos una, sin repetidas) y la
 * ciudad es el id real del select, no el nombre.
 */
function toCreatePayload(form: RecordData): SchoolWithCampusesRequestDto {
  return {
    ...toPayload(form),
    campuses: toCampuses(form['campuses']),
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
  private campusesService = inject(CampusesService);
  private citiesService = inject(CitiesService);

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

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.schoolsService.search(query).subscribe({
      next: (list) => this.schools.set(list.map(fromApi)),
    });
  }

  onCreated(form: RecordData): void {
    this.schoolsService.createWithCampuses(toCreatePayload(form)).subscribe({
      next: (created) => {
        this.register?.setValidationMessage('');
        this.register?.resetForm();
        this.load();
        // El colegio se crea junto con sus sedes; la lista las muestra solas,
        // asi que recargar ya basta para ver "Colegio (N sedes)" si la vista lo
        // llegara a mostrar. `created` queda disponible si hace falta navegar.
        void created;
      },
      error: (err) => {
        this.register?.setValidationMessage(
          describeProblem(err, 'No se pudo registrar la escuela. Verifica que el backend esté disponible.')
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
  cityOptions: CityListDto[] = [];

  showUpdate(school: RecordData): void {
    const id = school['id'];
    if (!id) return;
    forkJoin({
      detail: this.schoolsService.get(String(id)),
      campuses: this.campusesService.listBySchool(String(id)),
      cities: this.citiesService.list(),
    }).subscribe({
      next: ({ detail, campuses, cities }) => {
        this.cityOptions = cities;
        this.schoolSelected = {
          ...fromDetail(detail),
          city: detail.cityId,
          campuses: campuses.map((campus) => ({ ...campus })),
        };
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

    const payload: SchoolWithCampusesRequestDto = {
      ...toPayload(updatedRecord),
      campuses: toCampuses(updatedRecord['campuses']),
    };
    this.schoolsService.updateWithCampuses(String(id), payload).subscribe({
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
