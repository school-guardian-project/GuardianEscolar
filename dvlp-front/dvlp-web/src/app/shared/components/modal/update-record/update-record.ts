import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

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
  [key: string]: string | number | boolean | null;
}

export interface Field {
  name: string;
  type: 'text' | 'date' | 'select' | 'tel' | 'email';
  placeholder?: string;
  options?: string[];
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
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule],
  templateUrl: './update-record.html',
  styleUrl: './update-record.css',
})
export class UpdateRecord implements OnInit {
  @Input() type: RegisterType = 'student';
  @Input() record: RecordData = {};

  @Output() saved = new EventEmitter<RecordData>();
  @Output() closed = new EventEmitter<void>();

  formData: Record<string, string> = {};
  fields: Field[] = [];

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
    this.fields = UPDATE_FIELDS[this.type];

    this.fields.forEach(f => {
      this.formData[f.name] = (this.record[f.name] as string) || '';
    });
  }

  getLabelKey(field: Field): string {
    return `update_record.${this.type}.fields.${field.name}`;
  }

  close(): void {
    this.closed.emit();
  }

  onSubmit(): void {
    this.saved.emit({ ...this.record, ...this.formData });
  }
}