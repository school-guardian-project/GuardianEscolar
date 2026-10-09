import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RecordData, RegisterType } from './record-information.types';
export type { RecordData, RegisterType } from './record-information.types';

const RECORD_CONFIG: Record<RegisterType, { icon: string; fields: string[] }> = {
  student: { icon: 'person', fields: ['names', 'lastNames', 'documentType', 'identification', 'birthDate', 'campusName', 'phone', 'address', 'email'] },
  guardian: { icon: 'people', fields: ['names', 'lastNames', 'email', 'documentType', 'identification', 'birthDate', 'campusName', 'phone', 'address'] },
  driver: { icon: 'directions_car', fields: ['names', 'lastNames', 'documentType', 'identification', 'birthDate', 'campusName', 'licenseExpiration', 'licenseNumber', 'address', 'email'] },
  family: { icon: 'family_restroom', fields: ['name', 'guardian', 'student', 'observations'] },
  bus: { icon: 'directions_bus', fields: ['plate', 'driver', 'campusName', 'brand', 'model', 'capacity', 'soat', 'gps', 'gpsStatus', 'status'] },
  stop: { icon: 'location_on', fields: ['name', 'student', 'city', 'school', 'address', 'route'] },
  route: { icon: 'route', fields: ['name', 'campusName', 'startTime', 'endTime', 'destination'] },
  admins: { icon: 'admin_panel_settings', fields: ['name', 'lastNames', 'cityName', 'schoolName', 'email', 'identification', 'birthDate', 'phone', 'address'] },
  schools: { icon: 'school', fields: ['name', 'city', 'address', 'phone', 'schooling', 'email', 'website', 'status'] },
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
  /**
   * Muestra el botón «Asignar» en el modal. Solo lo activa la vista que tiene
   * flujo de asignación (estudiante→ruta/parada, bus→conductor, ruta→bus): el
   * listado ya no ofrece ese acceso, la acción vive en la vista.
   */
  @Input() canAssign = false;
  @Output() closed = new EventEmitter<void>();
  @Output() assign = new EventEmitter<RecordData>();

  close(): void {
    this.closed.emit();
  }

  assignRecord(): void {
    this.assign.emit(this.record);
  }

  get config() {
    return RECORD_CONFIG[this.type];
  }

  get titleKey(): string {
    return `record_information.${this.type}.title`;
  }

  get displayName(): string {
    return (
      (this.type === 'schools' ? this.record?.['name'] : '') ||
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