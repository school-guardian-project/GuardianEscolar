import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { LocationMap } from '@shared/components/location-map/location-map';

export type RegisterType =
  | 'student'
  | 'guardian'
  | 'driver'
  | 'family'
  | 'bus'
  | 'stop'
  | 'route'
  | 'admins'
  | 'schools';

export interface RecordData {
  [key: string]: string | number | boolean | null | RecordData[];
}

interface CampusFormData extends RecordData {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Field {
  name: string;
  type: 'text' | 'date' | 'select' | 'tel' | 'email';
  placeholder?: string;
  options?: string[];
  optionLabels?: Record<string, string>;
  halfWidth?: boolean;
}

interface ModalConfig {
  icon: string;
  displayName?: string;
  displayType?: string;
}

//  quitamos labels hardcodeados
const UPDATE_FIELDS: Record<RegisterType, Field[]> = {
  student: [
    { name: 'names', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'documentType', type: 'select', options: ['CC', 'TI'] },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'phone', type: 'tel', halfWidth: true },
    { name: 'address', type: 'text' },
    { name: 'email', type: 'email' },
  ],

  // los demás igual, solo con name/type sin label
  guardian: [
    { name: 'name', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'documentType', type: 'select', options: ['CC', 'CE'] },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'phone', type: 'tel' },
    { name: 'address', type: 'text' },
  ],

  driver: [
    { name: 'names', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'documentType', type: 'select', options: ['CC', 'CE'] },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'licenseExpiration', type: 'date', halfWidth: true },
    { name: 'licenseNumber', type: 'text', halfWidth: true },
    { name: 'address', type: 'text' },
    { name: 'email', type: 'email' },
  ],

  family: [
    { name: 'name', type: 'text' },
    { name: 'guardian', type: 'select', options: [] },
    { name: 'student', type: 'select', options: [] },
    { name: 'observations', type: 'text' },
  ],

  bus: [
    { name: 'plate', type: 'text' },
    { name: 'driver', type: 'select', options: [] },
    { name: 'model', type: 'text' },
    { name: 'brand', type: 'text' },
    { name: 'capacity', type: 'text' },
    { name: 'soat', type: 'date', halfWidth: true },
    { name: 'gps', type: 'select', options: ['Activo', 'Inactivo'], halfWidth: true },
  ],

  stop: [
    { name: 'name', type: 'text' },
    { name: 'student', type: 'select', options: [] },
    { name: 'city', type: 'select', options: [] },
    { name: 'school', type: 'select', options: [] },
    { name: 'address', type: 'text' },
    { name: 'latitude', type: 'text' },
    { name: 'longitude', type: 'text' },
  ],

  route: [
    { name: 'name', type: 'text' },
    { name: 'sector', type: 'text' },
    { name: 'startTime', type: 'text' },
    { name: 'endTime', type: 'text' },
    { name: 'destination', type: 'text' },
    { name: 'routeSector', type: 'select', options: [] },
  ],

  admins: [
    { name: 'name', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'city', type: 'select', options: [] },
    { name: 'school', type: 'select', options: [] },
    { name: 'email', type: 'email' },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'phone', type: 'tel' },
    { name: 'address', type: 'text' },
  ],

  schools: [
    { name: 'name', type: 'text' },
    { name: 'city', type: 'select', options: ['Bogotá'] },
    { name: 'address', type: 'text' },
    { name: 'phone', type: 'tel' },
    { name: 'schooling', type: 'select', options: ['Primaria'] },
    { name: 'email', type: 'email' },
    { name: 'website', type: 'text' },
  ],
};

const MODAL_CONFIGS: Record<RegisterType, ModalConfig> = {
  student: { icon: 'person', displayName: 'names', displayType: 'identification' },
  guardian: { icon: 'people', displayName: 'name', displayType: 'documentType' },
  driver: { icon: 'directions_car', displayName: 'names', displayType: 'licenseNumber' },
  family: { icon: 'home', displayName: 'name' },
  bus: { icon: 'directions_bus', displayName: 'plate' },
  stop: { icon: 'location_on', displayName: 'name' },
  route: { icon: 'route', displayName: 'name' },
  admins: { icon: 'admin_panel_settings', displayName: 'name' },
  schools: { icon: 'school', displayName: 'name' },
};

@Component({
  selector: 'app-update-record',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule, LocationMap],
  templateUrl: './update-record.html',
  styleUrl: './update-record.css',
})
export class UpdateRecord implements OnInit {
  @Input() type: RegisterType = 'student';
  @Input() record: RecordData = {};
  /** Opciones dinámicas por campo (perfiles registrados de acudientes/estudiantes). */
  @Input() fieldOptions: Record<string, string[]> = {};
  @Input() cityOptions: { id: string; name: string }[] = [];
  @Input() schoolOptions: { id: string; name: string; cityId?: string }[] = [];

  @Output() saved = new EventEmitter<RecordData>();
  @Output() closed = new EventEmitter<void>();

  formData: Record<string, string> = {};
  campuses: CampusFormData[] = [];
  schoolMapOpen = false;
  campusMapOpenIndex: number | null = null;
  fields: Field[] = [];
  campusErrorKey = '';
  campusErrorName = '';

  get config() {
    return MODAL_CONFIGS[this.type];
  }

  get titleKey(): string {
    return `update_record.${this.type}.title`;
  }

  get displayName(): string {
    const key = this.config.displayName;
    return key ? (this.record[key] as string) || '' : '';
  }

  ngOnInit(): void {
    this.fields = UPDATE_FIELDS[this.type].map((field) => {
      if (this.type === 'admins' && field.name === 'city') {
        return {
          ...field,
          options: this.cityOptions.map((city) => city.id),
          optionLabels: Object.fromEntries(this.cityOptions.map((city) => [city.id, city.name])),
        };
      }
      if (this.type === 'admins' && field.name === 'school') {
        return {
          ...field,
          options: this.getSchoolsForSelectedCity().map((school) => school.id),
          optionLabels: Object.fromEntries(this.schoolOptions.map((school) => [school.id, school.name])),
        };
      }
      if (this.type === 'schools' && field.name === 'city' && this.cityOptions.length) {
        return {
          ...field,
          options: this.cityOptions.map((city) => city.id),
          optionLabels: Object.fromEntries(this.cityOptions.map((city) => [city.id, city.name])),
        };
      }
      return this.fieldOptions[field.name] ? { ...field, options: this.fieldOptions[field.name] } : field;
    });

    this.fields.forEach(f => {
      this.formData[f.name] = (this.record[f.name] as string) || '';
    });
    this.formData['latitude'] = this.record['latitude'] == null ? '' : String(this.record['latitude']);
    this.formData['longitude'] = this.record['longitude'] == null ? '' : String(this.record['longitude']);
    const campusRecords = this.record['campuses'];
    this.campuses = Array.isArray(campusRecords)
      ? campusRecords.map((value) => {
          const campus = value as CampusFormData;
          return {
            id: campus.id ?? '',
            name: campus.name ?? '',
            address: campus.address ?? '',
            latitude: campus.latitude == null ? null : Number(campus.latitude),
            longitude: campus.longitude == null ? null : Number(campus.longitude),
          };
        })
      : [];
  }

  getLabelKey(field: Field): string {
    return `update_record.${this.type}.fields.${field.name}`;
  }

  getFieldOptions(field: Field): string[] {
    if (this.type === 'admins' && field.name === 'school') {
      return this.getSchoolsForSelectedCity().map((school) => school.id);
    }
    return field.options ?? [];
  }

  onFieldChange(fieldName: string, value: string): void {
    this.formData[fieldName] = value;
    if (this.type === 'admins' && fieldName === 'city') {
      const selectedSchool = this.schoolOptions.find((school) => school.id === this.formData['school']);
      if (selectedSchool && selectedSchool.cityId !== value) this.formData['school'] = '';
    }
  }

  private getSchoolsForSelectedCity(): { id: string; name: string; cityId?: string }[] {
    const cityId = this.formData['city'];
    return this.schoolOptions.filter((school) => !cityId || school.cityId === cityId);
  }

  close(): void {
    this.closed.emit();
  }

  onLocationChange(coordinates: { latitude: number; longitude: number }): void {
    this.formData['latitude'] = String(coordinates.latitude);
    this.formData['longitude'] = String(coordinates.longitude);
  }

  onAddressChange(address: string): void {
    this.formData['address'] = address;
  }

  onCampusLocationChange(index: number, coordinates: { latitude: number; longitude: number }): void {
    this.campuses[index].latitude = coordinates.latitude;
    this.campuses[index].longitude = coordinates.longitude;
  }

  onCampusAddressChange(index: number, address: string): void {
    this.campuses[index].address = address;
  }

  addCampus(): void {
    this.campuses = [...this.campuses, { id: '', name: '', address: '', latitude: null, longitude: null }];
  }

  removeCampus(index: number): void {
    this.campuses = this.campuses.filter((_, campusIndex) => campusIndex !== index);
    if (this.campusMapOpenIndex === index) this.campusMapOpenIndex = null;
    else if (this.campusMapOpenIndex !== null && this.campusMapOpenIndex > index) this.campusMapOpenIndex--;
  }

  onSubmit(): void {
    this.campusErrorKey = '';
    this.campusErrorName = '';
    if (this.type === 'schools') {
      const names = new Set<string>();
      for (const campus of this.campuses) {
        const name = campus.name.trim();
        const address = campus.address.trim();
        if (!name || name.length > 30 || address.length < 5 || address.length > 255) {
          this.campusErrorKey = 'register.schools.campusAddressRequired';
          return;
        }
        const normalizedName = name.toLowerCase();
        if (names.has(normalizedName)) {
          this.campusErrorKey = 'register.schools.campusNamesDuplicated';
          this.campusErrorName = name;
          return;
        }
        names.add(normalizedName);
      }
    }

    this.saved.emit({
      ...this.record,
      ...this.formData,
      latitude: this.formData['latitude'] ? Number(this.formData['latitude']) : null,
      longitude: this.formData['longitude'] ? Number(this.formData['longitude']) : null,
      campuses: this.campuses.map((campus) => ({ ...campus })),
    });
  }
}