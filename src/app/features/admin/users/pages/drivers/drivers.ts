import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { NavbarAdmin } from '@shared/components/navbar/navbar-admin/navbar-admin';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';
import { ErrorAlert } from '@shared/components/modal/error-alert/error-alert';
import { DriversService } from '@core/services/drivers.service';
import { CitiesService } from '@core/services/cities.service';
import { CityListDto } from '@core/models/city.model';
import { PersonListDto, PersonRequestDto, CreatePersonRequestDto, PersonResponseDto } from '@core/models/student.model';
import { describeProblem } from '@core/http/problem-detail';
import { forkJoin } from 'rxjs';

interface DriverView extends RecordData {
  id?: string;
  names: string;
  lastNames: string;
  name: string;
  identification: string;
  phone: string;
  cityId?: string | null;
  cityName?: string;
  city?: string;
  licenseNumber?: string;
  licenseExpiration?: string;
  documentType?: string;
  birthDate?: string;
  address?: string;
  email?: string;
}

function fromApi(api: PersonListDto): DriverView {
  const names = api.name ?? '';
  const lastNames = api.lastName ?? '';
  return {
    id: api.id,
    names,
    lastNames,
    name: `${names} ${lastNames}`.trim(),
    identification: api.identificationNumber ?? '',
    phone: api.phone != null ? String(api.phone) : '',
    cityId: api.cityId,
    licenseNumber: api.licenseNumber ?? '',
    licenseExpiration: api.licenseExpirationDate ?? '',
  };
}

const IDENTIFICATION_LABELS = ['TI', 'CC'];

function fromDetail(api: PersonResponseDto): DriverView {
  return {
    ...fromApi(api),
    documentType: IDENTIFICATION_LABELS[api.identificationType] ?? '',
    birthDate: api.dateBirth ?? '',
    city: api.cityId ?? '',
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
    cityId: String(form['city'] ?? form['cityId'] ?? '').trim(),
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
  selector: 'app-drivers',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
    TranslateModule,
    NavbarManage,
    CardRegister,
    CardList,
    NavbarAdmin,
    RecordInformation,
    UpdateRecord,
    DeleteRecord,
    ErrorAlert,
  ],
  templateUrl: './drivers.html',
  styleUrl: './drivers.scss',
})
export class Drivers implements OnInit {
  private driversService = inject(DriversService);
  private citiesService = inject(CitiesService);
  private translate = inject(TranslateService);

  @ViewChild(CardRegister) register?: CardRegister;

  drivers = signal<DriverView[]>([]);
  cityOptions: CityListDto[] = [];
  actionError = '';

  ngOnInit(): void {
    this.load();
    this.citiesService.list().subscribe({
      next: (cities) => {
        this.cityOptions = cities;
        this.drivers.update((drivers) => drivers.map((driver) => this.withCityName(driver)));
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, this.translate.instant('errors.drivers.load'));
      },
    });
  }

  private withCityName(driver: DriverView): DriverView {
    return {
      ...driver,
      cityName: this.cityOptions.find((city) => city.id === driver.cityId)?.name ?? '',
    };
  }

  private load(): void {
    this.driversService.list().subscribe({
      next: (list) => this.drivers.set(list.map((driver) => this.withCityName(fromApi(driver)))),
      error: (error: unknown) => {
        this.actionError = describeProblem(error, this.translate.instant('errors.drivers.load'));
      },
    });
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.driversService.search(query).subscribe({
      next: (list) => this.drivers.set(list.map((driver) => this.withCityName(fromApi(driver)))),
      error: (error: unknown) => {
        this.actionError = describeProblem(error, this.translate.instant('errors.drivers.search'));
      },
    });
  }

  onCreated(form: RecordData): void {
    this.driversService.create(toCreatePayload(form)).subscribe({
      next: () => {
        this.register?.setValidationMessage('');
        this.register?.resetForm();
        this.load();
      },
      error: (err) => {
        this.register?.setValidationMessage(
          describeProblem(err, this.translate.instant('errors.drivers.create'))
        );
      },
    });
  }

  showModal = false;
  driverSelected: RecordData = {};

  showDetails(driver: RecordData): void {
    const id = driver['id'];
    if (!id) return;
    forkJoin({
      detail: this.driversService.get(String(id)),
      cities: this.citiesService.list(),
    }).subscribe({
      next: ({ detail, cities }) => {
        this.cityOptions = cities;
        this.driverSelected = this.withCityName(fromDetail(detail));
        this.showModal = true;
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, this.translate.instant('errors.drivers.get'));
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.driverSelected = {};
  }

  showUpdateModal = false;

  showUpdate(driver: RecordData): void {
    const id = driver['id'];
    if (!id) return;
    this.actionError = '';
    forkJoin({
      detail: this.driversService.get(String(id)),
      cities: this.citiesService.list(),
    }).subscribe({
      next: ({ detail, cities }) => {
        this.cityOptions = cities;
        this.driverSelected = this.withCityName(fromDetail(detail));
        this.showUpdateModal = true;
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, this.translate.instant('errors.drivers.getForUpdate'));
      },
    });
  }

  closeUpdateModal(): void {
    this.actionError = '';
    this.showUpdateModal = false;
    this.driverSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }

    this.actionError = '';
    this.driversService.update(String(id), toPayload(updatedRecord)).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, this.translate.instant('errors.drivers.update'));
      },
    });
  }

  showDeleteModal = false;

  showDelete(driver: RecordData): void {
    if (!driver['id']) return;
    this.actionError = '';
    this.driverSelected = driver;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.actionError = '';
    this.showDeleteModal = false;
    this.driverSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.driversService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, this.translate.instant('errors.drivers.delete'));
      },
    });
  }
}
