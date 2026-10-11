import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ValidationRule, validateField } from '@core/validators/form-validators';
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
  [key: string]: string | number | boolean | null | string[] | RecordData[];
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
  type: 'text' | 'date' | 'select' | 'tel' | 'email' | 'time';
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
    { name: 'names', type: 'text' },
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
    { name: 'capacity', type: 'text' },
    { name: 'soat', type: 'date' },
    { name: 'gps', type: 'select', options: [] },
    { name: 'gpsImei', type: 'text' },
    { name: 'gpsStatus', type: 'select', options: [] },
  ],

  stop: [
    { name: 'name', type: 'text' },
    { name: 'student', type: 'select', options: [] },
    { name: 'city', type: 'select', options: [] },
    { name: 'school', type: 'select', options: [] },
    { name: 'address', type: 'text' },
    // Latitud/longitud no se editan a mano: las fija el mapa a partir de la dirección.
    { name: 'route', type: 'select', options: [] },
  ],

  route: [
    { name: 'name', type: 'text' },
    { name: 'campus', type: 'select', options: [] },
    { name: 'startTime', type: 'time' },
    { name: 'endTime', type: 'time' },
    { name: 'destination', type: 'text' },
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
    { name: 'status', type: 'select', options: ['Active', 'Inactive'] },
  ],
};

const R = (rule: ValidationRule = {}): ValidationRule => ({ required: true, ...rule });

/** Reglas del modal de edición: los errores se muestran bajo cada campo, como en el login. */
const UPDATE_RULES: Record<RegisterType, Record<string, ValidationRule>> = {
  student: {
    names: R({ minLength: 2 }), lastNames: R({ minLength: 2 }), documentType: R(),
    identification: R({ pattern: 'number', minLength: 5 }), birthDate: R(),
    phone: R({ minLength: 7 }), address: R({ minLength: 5 }), email: R({ pattern: 'email' }),
  },
  guardian: {
    names: R({ minLength: 2 }), lastNames: R({ minLength: 2 }), email: R({ pattern: 'email' }),
    documentType: R(), identification: R({ pattern: 'number', minLength: 5 }), birthDate: R(),
    phone: R({ minLength: 7 }), address: R({ minLength: 5 }),
  },
  driver: {
    names: R({ minLength: 2 }), lastNames: R({ minLength: 2 }), documentType: R(),
    identification: R({ pattern: 'number', minLength: 5 }), birthDate: R(),
    licenseExpiration: R(), licenseNumber: R({ minLength: 5 }), address: R({ minLength: 5 }),
    email: R({ pattern: 'email' }),
  },
  family: { name: R({ minLength: 2 }), guardian: R() },
  bus: {
    plate: R({ minLength: 3 }), capacity: R({ pattern: 'number', min: 1, max: 100 }), soat: R(),
    gpsStatus: R(),
  },
  stop: {
    name: R({ minLength: 2, maxLength: 30 }), city: R(), school: R(),
    address: R({ minLength: 5, maxLength: 255 }),
  },
  route: { name: R({ minLength: 2 }), campus: R(), startTime: R(), endTime: R(), destination: R() },
  admins: {
    name: R({ minLength: 2 }), lastNames: R({ minLength: 2 }), city: R(), school: R(),
    email: R({ pattern: 'email' }), identification: R({ pattern: 'number', minLength: 5 }),
    birthDate: R(), phone: R({ minLength: 7 }), address: R({ minLength: 5 }),
  },
  schools: {
    name: R({ minLength: 2, maxLength: 30 }), city: R(), address: R({ minLength: 5, maxLength: 255 }),
    phone: R({ minLength: 7 }), schooling: R(), email: R({ pattern: 'email', maxLength: 50 }),
    website: { pattern: 'url', maxLength: 100 }, status: R(),
  },
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
export class UpdateRecord implements OnInit, OnChanges {
  private translate = inject(TranslateService);
  @Input() type: RegisterType = 'student';
  @Input() record: RecordData = {};
  /** Opciones dinámicas por campo (perfiles registrados de acudientes/estudiantes). */
  @Input() fieldOptions: Record<string, string[]> = {};
  @Input() fieldOptionLabels: Record<string, Record<string, string>> = {};
  @Input() cityOptions: { id: string; name: string }[] = [];
  @Input() schoolOptions: { id: string; name: string; cityId?: string }[] = [];
  @Input() saveError = '';
  /** Errores del backend asociados a un campo concreto (p. ej. placa repetida). */
  @Input() saveFieldErrors: Record<string, string> = {};

  @Output() saved = new EventEmitter<RecordData>();
  @Output() closed = new EventEmitter<void>();

  formData: Record<string, string> = {};
  selectedStudents: string[] = [];
  campuses: CampusFormData[] = [];
  schoolMapOpen = false;
  campusMapOpenIndex: number | null = null;
  fields: Field[] = [];
  campusErrorKey = '';
  campusErrorName = '';
  fieldErrors: Record<string, string> = {};

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['saveFieldErrors']) {
      this.fieldErrors = { ...this.fieldErrors, ...(this.saveFieldErrors ?? {}) };
    }
  }

  getFieldError(name: string): string {
    return this.fieldErrors[name] ?? '';
  }

  /** El error general solo se muestra si no quedó ya debajo de un campo. */
  get generalError(): string {
    if (!this.saveError) return '';
    return Object.values(this.saveFieldErrors ?? {}).includes(this.saveError) ? '' : this.saveError;
  }

  private validate(): boolean {
    const rules = UPDATE_RULES[this.type] ?? {};
    const errors: Record<string, string> = {};
    for (const field of this.fields) {
      const rule = rules[field.name];
      if (!rule) continue;
      const error = validateField(this.formData[field.name], rule);
      if (error) {
        errors[field.name] = this.translate.instant(`validation.${this.errorKey(error)}`, {
          min: rule.minLength ?? rule.min,
          max: rule.maxLength ?? rule.max,
        });
      }
    }
    if (this.type === 'route' && !errors['startTime'] && !errors['endTime']
      && this.formData['endTime'] <= this.formData['startTime']) {
      errors['endTime'] = this.translate.instant('validation.timeOrder');
    }
    if (this.type === 'bus') {
      const imei = String(this.formData['gpsImei'] ?? '').trim();
      if (imei && !/^\d{15}$/.test(imei)) {
        errors['gpsImei'] = this.translate.instant('validation.imei');
      } else if (!imei && !this.formData['gps']) {
        errors['gps'] = this.translate.instant('validation.gpsRequired');
      }
    }
    this.fieldErrors = errors;
    return Object.keys(errors).length === 0;
  }

  private errorKey(error: string): string {
    if (/requerido|required/i.test(error)) return 'required';
    if (/correo|email/i.test(error)) return 'email';
    if (/url/i.test(error)) return 'url';
    if (/n.mero|number/i.test(error)) return 'number';
    if (/^M.nimo \d+$/.test(error)) return 'min';
    if (/^M.ximo \d+$/.test(error)) return 'max';
    if (/m.nimo|minimum/i.test(error)) return 'minLength';
    if (/m.ximo|maximum/i.test(error)) return 'maxLength';
    return 'required';
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
      return this.fieldOptions[field.name]
        ? { ...field, options: this.fieldOptions[field.name], optionLabels: this.fieldOptionLabels[field.name] }
        : field;
    });

    this.fields.forEach(f => {
      this.formData[f.name] = this.type === 'family' && f.name === 'student' ? '' : String(this.record[f.name] ?? '');
      // <input type="time"> espera HH:mm; el backend devuelve HH:mm:ss.
      if (f.type === 'time') this.formData[f.name] = this.formData[f.name].slice(0, 5);
    });
    if (this.type === 'family') {
      const children = this.record['student'];
      this.selectedStudents = Array.isArray(children)
        ? children.filter((child): child is string => typeof child === 'string')
        : String(children ?? '').split(',').map(child => child.trim()).filter(Boolean);
      this.selectedStudents = [...new Set(this.selectedStudents)];
      this.formData['student'] = '';
    }
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
    if (this.type === 'family' && fieldName === 'student') {
      if (value && !this.selectedStudents.includes(value)) this.selectedStudents = [...this.selectedStudents, value];
      this.formData['student'] = '';
      return;
    }
    this.formData[fieldName] = value;
    delete this.fieldErrors[fieldName];
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

  removeStudent(student: string): void {
    this.selectedStudents = this.selectedStudents.filter(value => value !== student);
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

    if (!this.validate()) return;

    this.saved.emit({
      ...this.record,
      ...this.formData,
      ...(this.type === 'family' ? { student: [...this.selectedStudents] } : {}),
      latitude: this.formData['latitude'] ? Number(this.formData['latitude']) : null,
      longitude: this.formData['longitude'] ? Number(this.formData['longitude']) : null,
      campuses: this.campuses.map((campus) => ({ ...campus })),
    });
  }
}