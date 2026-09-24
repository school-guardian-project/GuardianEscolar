import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RecordData, RegisterType } from './record-information.types';
export type { RecordData, RegisterType } from './record-information.types';

const RECORD_CONFIG: Record<RegisterType, { icon: string; fields: string[] }> = {
  student: { icon: 'person', fields: ['names', 'lastNames', 'documentType', 'identification', 'birthDate', 'phone', 'address', 'email'] },
  guardian: { icon: 'people', fields: ['name', 'lastNames', 'email', 'documentType', 'identification', 'birthDate', 'phone', 'address'] },
  driver: { icon: 'directions_car', fields: ['names', 'lastNames', 'documentType', 'identification', 'birthDate', 'licenseExpiration', 'licenseNumber', 'address', 'email'] },
  family: { icon: 'family_restroom', fields: ['name', 'guardian', 'student', 'observations'] },
  bus: { icon: 'directions_bus', fields: ['plate', 'driver', 'model', 'brand', 'capacity', 'gps', 'soat'] },
  stop: { icon: 'location_on', fields: ['name', 'student', 'city', 'address', 'latitude', 'longitude'] },
  route: { icon: 'route', fields: ['name', 'sector', 'startTime', 'endTime', 'destination', 'routeSector'] },
  admins: { icon: 'admin_panel_settings', fields: ['name', 'lastNames', 'email', 'identification', 'phone', 'birthDate', 'address'] },
  schools: { icon: 'school', fields: ['name', 'city', 'schooling', 'address', 'phone', 'email', 'website'] },
};

@Component({
  selector: 'app-record-information',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './record-information.html',
  styleUrl: './record-information.css',
})
export class RecordInformation {
  @Input() type: RegisterType = 'student';
  @Input() record: RecordData = {};
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  get config() {
    return RECORD_CONFIG[this.type];
  }

  get titleKey(): string {
    return `record_information.${this.type}.title`;
  }

  get displayName(): string {
    return (
      this.record?.['nombres'] ||
      this.record?.['nombre'] ||
      this.record?.['correo'] ||
      'Registro'
    );
  }

  getVisibleFields(): { key: string; value: any }[] {
    return this.config.fields
      .filter(key => {
        const value = this.record[key];
        return value !== null && value !== undefined && value !== '';
      })
      .map(key => ({
        key,
        value: this.record[key],
      }));
  }

  getLabelKey(key: string): string {
    return `record_information.${this.type}.fields.${key}`;
  }

  getGridClass(field: { key: string }): string {
    return 'col-1';
  }
}