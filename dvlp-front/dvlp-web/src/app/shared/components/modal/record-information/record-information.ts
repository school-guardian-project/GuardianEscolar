import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RecordData, RegisterType } from './record-information.types';
export type { RecordData, RegisterType } from './record-information.types';

const RECORD_CONFIG: Record<RegisterType, { icon: string; fields: string[] }> = {
  estudiante: { icon: 'person',             fields: ['nombres', 'apellidos', 'tipoId', 'identificacion', 'fechaNac', 'curso', 'telefono', 'direccion', 'correo'] },
  acudiente:  { icon: 'people',             fields: ['nombre', 'apellidos', 'correo', 'tipoId', 'identificacion', 'fechaNac', 'telefono', 'direccion'] },
  conductor:  { icon: 'directions_car',     fields: ['nombres', 'apellidos', 'tipoId', 'identificacion', 'fechaNac', 'vencLicencia', 'licencia', 'direccion', 'correo'] },
  familia:    { icon: 'family_restroom',    fields: ['nombre', 'acudiente', 'estudiante', 'observaciones'] },
  bus:        { icon: 'directions_bus',     fields: ['matricula', 'conductor', 'modelo', 'marca', 'capacidad', 'gps', 'soat'] },
  parada:     { icon: 'location_on',        fields: ['nombre', 'ciudad', 'direccion', 'latitud', 'longitud'] },
  ruta:       { icon: 'route',              fields: ['nombre', 'sector', 'horaInicio', 'horaFin', 'destino', 'sectorRuta'] },
  admins:     { icon: 'admin_panel_settings', fields: ['nombre', 'apellidos', 'correo', 'identificacion', 'telefono', 'fechaNac', 'direccion'] },
  schools:    { icon: 'school',             fields: ['nombre', 'ciudad', 'escolaridad', 'direccion', 'telefono', 'correo', 'web'] },
};

@Component({
  selector: 'app-record-information',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './record-information.html',
  styleUrl: './record-information.css',
})
export class RecordInformation {
  @Input() type: RegisterType = 'estudiante';
  @Input() record: RecordData = {};
  @Output() closed = new EventEmitter<void>();

  cerrar(): void {
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