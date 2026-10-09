import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { NavbarAdmin } from '@shared/components/navbar/navbar-admin/navbar-admin';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';
import { StopsService } from '@core/services/stops.service';
import { CitiesService } from '@core/services/cities.service';
import { SchoolsService } from '@core/services/schools.service';
import { RoutesService } from '@core/services/routes.service';
import { StudentsService } from '@core/services/students.service';
import { StopListDto, StopRequestDto } from '@core/models/stop.model';

interface StopView extends RecordData {
  id?: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  school: string;
  cityId: string;
  schoolId: string;
}

@Component({
  selector: 'app-stops',
  imports: [
    RouterModule,
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
    TranslateModule,
  ],
  templateUrl: './stops.html',
  styleUrl: './stops.scss',
})
export class Stops implements OnInit {
  private stopsService = inject(StopsService);
  private citiesService = inject(CitiesService);
  private schoolsService = inject(SchoolsService);
  private routesService = inject(RoutesService);
  private studentsService = inject(StudentsService);

  @ViewChild(CardRegister) register?: CardRegister;

  stops: StopView[] = [];
  fieldOptions: Record<string, string[]> = {};
  catalogLoadError = false;

  private loadCatalog<T>(source: Observable<T[]>, name: string): Observable<T[]> {
    return source.pipe(catchError(error => {
      console.error(`Error loading stop ${name}:`, error);
      this.catalogLoadError = true;
      return of([]);
    }));
  }

  showModal = false;
  showUpdateModal = false;
  showDeleteModal = false;
  stopSelected: RecordData = {};

  private cityIdByLabel: Record<string, string> = {};
  private schoolIdByLabel: Record<string, string> = {};
  private routeIdByLabel: Record<string, string> = {};
  private cityLabelById: Record<string, string> = {};
  private schoolLabelById: Record<string, string> = {};

  ngOnInit(): void {
    forkJoin({
      cities: this.loadCatalog(this.citiesService.list(), 'cities'),
      schools: this.loadCatalog(this.schoolsService.list(), 'schools'),
      routes: this.loadCatalog(this.routesService.list(), 'routes'),
      students: this.loadCatalog(this.studentsService.list(), 'students'),
    }).subscribe({
      next: ({ cities, schools, routes, students }) => {
        this.cityIdByLabel = Object.fromEntries(cities.map((city) => [city.name, city.id]));
        this.schoolIdByLabel = Object.fromEntries(schools.map((school) => [school.name, school.id]));
        this.routeIdByLabel = Object.fromEntries(routes.map((route) => [route.name, route.id]));
        this.cityLabelById = Object.fromEntries(cities.map((city) => [city.id, city.name]));
        this.schoolLabelById = Object.fromEntries(schools.map((school) => [school.id, school.name]));

        this.fieldOptions = {
          city: Object.keys(this.cityIdByLabel),
          school: Object.keys(this.schoolIdByLabel),
          route: Object.keys(this.routeIdByLabel),
          student: students
            .map((s) => `${s.name ?? ''} ${s.lastName ?? ''}`.trim())
            .filter(Boolean),
        };

        this.load();
      },
    });
  }

  private load(): void {
    this.stopsService.list().subscribe({
      next: (list) => (this.stops = list.map((api) => this.fromApi(api))),
    });
  }

  private fromApi(api: StopListDto): StopView {
    return {
      id: api.id,
      name: api.name ?? '',
      address: api.address ?? '',
      latitude: api.latitude != null ? String(api.latitude) : '',
      longitude: api.longitude != null ? String(api.longitude) : '',
      cityId: api.cityId ?? '',
      schoolId: api.schoolId ?? '',
      city: this.cityLabelById[api.cityId ?? ''] ?? '',
      school: this.schoolLabelById[api.schoolId ?? ''] ?? '',
    };
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.stopsService.search(query).subscribe({
      next: (list) => (this.stops = list.map((api) => this.fromApi(api))),
    });
  }

  onCreated(form: RecordData): void {
    const cityId = this.cityIdByLabel[String(form['city'] ?? '')];
    const schoolId = this.schoolIdByLabel[String(form['school'] ?? '')];
    const routeId = this.routeIdByLabel[String(form['route'] ?? '')];
    const latitude = this.toCoordinate(form['latitude']);
    const longitude = this.toCoordinate(form['longitude']);

    if (!cityId || !schoolId) {
      this.register?.setValidationMessage('Selecciona la ciudad y la escuela.');
      return;
    }
    if (latitude === null || longitude === null) {
      this.register?.setValidationMessage('Ubica la dirección en el mapa antes de registrar la parada.');
      return;
    }

    const payload: StopRequestDto = {
      name: String(form['name'] ?? ''),
      cityId,
      schoolId,
      address: String(form['address'] ?? ''),
      latitude,
      longitude,
    };

    this.stopsService.create(payload).subscribe({
      next: (created) => this.attachToRoute(created.id, routeId),
      error: () => this.register?.setValidationMessage('No se pudo registrar la parada.'),
    });
  }

  private attachToRoute(stopId: string, routeId: string): void {
    if (!routeId) {
      this.register?.setValidationMessage('Selecciona una ruta válida.');
      return;
    }

    this.routesService.addStop(routeId, stopId).subscribe({
      next: () => this.finishRegistration(''),
      error: () => this.finishRegistration('La parada se creó, pero no se pudo agregar a la ruta.'),
    });
  }

  private finishRegistration(message: string): void {
    this.register?.resetForm();
    if (message) this.register?.setValidationMessage(message);
    this.load();
  }

  showDetails(stop: RecordData): void {
    this.stopSelected = stop;
    this.showModal = true;
  }

  showUpdateDetails(stop: RecordData): void {
    this.stopSelected = stop;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.stopSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.stopSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }

    const latitude = this.toCoordinate(updatedRecord['latitude']) ?? this.toCoordinate(this.stopSelected['latitude']);
    const longitude = this.toCoordinate(updatedRecord['longitude']) ?? this.toCoordinate(this.stopSelected['longitude']);

    if (latitude === null || longitude === null) return;

    const payload: StopRequestDto = {
      name: String(updatedRecord['name'] ?? ''),
      cityId:
        this.cityIdByLabel[String(updatedRecord['city'] ?? '')] ?? String(updatedRecord['cityId'] ?? ''),
      schoolId:
        this.schoolIdByLabel[String(updatedRecord['school'] ?? '')] ??
        String(updatedRecord['schoolId'] ?? ''),
      address: String(updatedRecord['address'] ?? ''),
      latitude,
      longitude,
    };

    this.stopsService.update(String(id), payload).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
    });
  }

  showDelete(stop: RecordData): void {
    this.stopSelected = stop;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.stopSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }
    this.stopsService.remove(String(id)).subscribe(() => {
      this.closeDeleteModal();
      this.load();
    });
  }

  private toCoordinate(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
