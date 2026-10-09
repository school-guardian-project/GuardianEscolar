import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { CityListDto } from '@core/models/city.model';
import { SchoolCampusRequestDto, SchoolResponseDto, SchoolWithCampusesRequestDto } from '@core/models/school.model';
import { CitiesService } from '@core/services/cities.service';
import { CampusesService, CampusListDto } from '@core/services/campuses.service';
import { SchoolsService } from '@core/services/schools.service';
import { LocationMap } from '@shared/components/location-map/location-map';

@Component({
  selector: 'app-update-information',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule, LocationMap],
  templateUrl: './update-information.html',
  styleUrl: './update-information.css',
})
export class UpdateInformation implements OnInit {
  @Input() schoolId: string | null = null;
  @Output() closed = new EventEmitter<void>();

  nombreEscuela: string = '';
  ciudad = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  website: string = '';
  logo = '';
  latitude: number | null = null;
  longitude: number | null = null;
  cities: CityListDto[] = [];
  campuses: CampusListDto[] = [];
  campusMaps: boolean[] = [];
  schoolMapOpen = false;
  loading = true;
  saving = false;
  enviado: boolean = false;
  mostrandoError: boolean = false;

  constructor(
    private readonly schoolsService: SchoolsService,
    private readonly campusesService: CampusesService,
    private readonly citiesService: CitiesService,
  ) {}

  ngOnInit(): void {
    if (!this.schoolId) {
      this.loading = false;
      this.mostrandoError = true;
      return;
    }

    forkJoin({
      school: this.schoolsService.get(this.schoolId),
      campuses: this.campusesService.listBySchool(this.schoolId),
      cities: this.citiesService.list(),
    }).subscribe({
      next: ({ school, campuses, cities }) => {
        this.loadSchool(school, campuses, cities);
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('No se pudo cargar la información del colegio para actualizarla.', error);
        this.loading = false;
        this.mostrandoError = true;
      },
    });
  }

  private loadSchool(school: SchoolResponseDto, campuses: CampusListDto[], cities: CityListDto[]): void {
    this.nombreEscuela = school.name ?? '';
    this.ciudad = school.cityId ?? '';
    this.direccion = school.address ?? '';
    this.telefono = String(school.phone ?? '');
    this.email = school.email ?? '';
    this.website = school.website ?? '';
    this.logo = school.logo ?? '';
    this.latitude = school.latitude ?? null;
    this.longitude = school.longitude ?? null;
    this.cities = cities;
    this.campuses = campuses.map((campus) => ({ ...campus }));
    this.campusMaps = this.campuses.map(() => false);
  }

  addCampus(): void {
    this.campuses.push({ id: '', name: '', address: '', latitude: null, longitude: null });
    this.campusMaps.push(false);
  }

  updateSchoolLocation(location: { latitude: number; longitude: number }): void {
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  }

  updateCampusLocation(index: number, location: { latitude: number; longitude: number }): void {
    this.campuses[index] = { ...this.campuses[index], latitude: location.latitude, longitude: location.longitude };
  }

  updateSchoolAddress(address: string): void {
    this.direccion = address;
  }

  updateCampusAddress(index: number, address: string): void {
    this.campuses[index] = { ...this.campuses[index], address };
  }

  update(): void {
    if (!this.schoolId || !this.nombreEscuela.trim() || !this.ciudad || !this.direccion.trim()
      || !this.telefono.trim() || !this.email.trim()
      || this.campuses.some((campus) => !campus.name.trim() || campus.name.trim().length > 30
        || campus.address.trim().length < 5 || campus.address.trim().length > 255)) {
      this.mostrandoError = true;
      return;
    }
    const campusNames = this.campuses.map((campus) => campus.name.trim().toLowerCase());
    if (new Set(campusNames).size !== campusNames.length) {
      this.mostrandoError = true;
      return;
    }

    this.mostrandoError = false;
    this.saving = true;
    const campuses: SchoolCampusRequestDto[] = this.campuses.map(({ id, name, address, latitude, longitude }) => ({
      ...(id ? { id } : {}),
      name: name.trim(),
      address: address.trim(),
      latitude,
      longitude,
    }));
    const payload: SchoolWithCampusesRequestDto = {
      cityId: this.ciudad,
      logo: this.logo,
      name: this.nombreEscuela.trim(),
      address: this.direccion.trim(),
      latitude: this.latitude,
      longitude: this.longitude,
      phone: Number(this.telefono.replace(/\D/g, '')),
      email: this.email.trim(),
      website: this.website.trim(),
      campuses,
    };

    if (!Number.isFinite(payload.phone)) {
      this.mostrandoError = true;
      this.saving = false;
      return;
    }

    this.schoolsService.updateWithCampuses(this.schoolId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.enviado = true;
      },
      error: (error: unknown) => {
        console.error('No se pudo actualizar el colegio y sus sedes.', error);
        this.saving = false;
        this.mostrandoError = true;
      },
    });
  }

  close(): void {
    this.enviado = false;
    this.mostrandoError = false;
    this.nombreEscuela = '';
    this.ciudad = '';
    this.direccion = '';
    this.telefono = '';
    this.email = '';
    this.website = '';
    this.campuses = [];
    this.campusMaps = [];
    this.closed.emit();
  }
}