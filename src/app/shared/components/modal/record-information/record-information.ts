import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type RegisterType =
  | 'estudiante'
  | 'acudiente'
  | 'conductor'
  | 'familia'
  | 'bus'
  | 'parada'
  | 'ruta'
  | 'admins'
  | 'schools';

export interface RecordData {
  [key: string]: string | number | boolean | null;
}

interface ModalConfig {
  title: string;
  icon: string;
  fields: FieldConfig[];
  displayName?: string;
  displayType?: string;
}

interface FieldConfig {
  label: string;
  key: string;
  format?: (value: any) => string;
  grid?: 'half' | 'full';
}

const MODAL_CONFIGS: Record<RegisterType, ModalConfig> = {
  estudiante: {
    title: 'Información del Estudiante',
    icon: 'person',
    displayName: 'nombres',
    displayType: 'curso',
    fields: [
      { label: 'Nombres', key: 'nombres', grid: 'half' },
      { label: 'Apellidos', key: 'apellidos', grid: 'half' },
      { label: 'Tipo Identificación', key: 'tipoId', grid: 'half' },
      { label: 'Identificación', key: 'identificacion', grid: 'half' },
      { label: 'Fecha Nacimiento', key: 'fechaNac', grid: 'half' },
      { label: 'Curso', key: 'curso', grid: 'half' },
      { label: 'Teléfono', key: 'telefono', grid: 'half' },
      { label: 'Dirección', key: 'direccion', grid: 'full' },
      { label: 'Correo Electrónico', key: 'correo', grid: 'full' },
    ],
  },

  acudiente: {
    title: 'Información del Acudiente',
    icon: 'people',
    displayName: 'nombre',
    displayType: 'tipoId',
    fields: [
      { label: 'Nombre', key: 'nombre', grid: 'half' },
      { label: 'Apellidos', key: 'apellidos', grid: 'half' },
      { label: 'Correo Electrónico', key: 'correo', grid: 'half' },
      { label: 'Tipo Identificación', key: 'tipoId', grid: 'half' },
      { label: 'Identificación', key: 'identificacion', grid: 'half' },
      { label: 'Fecha Nacimiento', key: 'fechaNac', grid: 'half' },
      { label: 'Teléfono', key: 'telefono', grid: 'full' },
      { label: 'Dirección', key: 'direccion', grid: 'full' },
    ],
  },

  conductor: {
    title: 'Información del Conductor',
    icon: 'directions_car',
    displayName: 'nombres',
    displayType: 'licencia',
    fields: [
      { label: 'Nombres', key: 'nombres', grid: 'half' },
      { label: 'Apellidos', key: 'apellidos', grid: 'half' },
      { label: 'Tipo Identificación', key: 'tipoId', grid: 'half' },
      { label: 'Identificación', key: 'identificacion', grid: 'half' },
      { label: 'Fecha Nacimiento', key: 'fechaNac', grid: 'half' },
      { label: 'Vencimiento Licencia', key: 'vencLicencia', grid: 'half' },
      { label: 'Licencia Conducción', key: 'licencia', grid: 'half' },
      { label: 'Dirección', key: 'direccion', grid: 'full' },
      { label: 'Correo Electrónico', key: 'correo', grid: 'full' },
    ],
  },

  familia: {
    title: 'Información de la Familia',
    icon: 'home',
    displayName: 'nombre',
    displayType: 'acudiente',
    fields: [
      { label: 'Nombre', key: 'nombre', grid: 'full' },
      { label: 'Acudiente', key: 'acudiente', grid: 'half' },
      { label: 'Estudiante', key: 'estudiante', grid: 'half' },
      { label: 'Observaciones', key: 'observaciones', grid: 'full' },
    ],
  },

  bus: {
    title: 'Información del Bus',
    icon: 'directions_bus',
    displayName: 'matricula',
    displayType: 'marca',
    fields: [
      { label: 'Matrícula', key: 'matricula', grid: 'half' },
      { label: 'Conductor', key: 'conductor', grid: 'half' },
      { label: 'Modelo', key: 'modelo', grid: 'half' },
      { label: 'Marca', key: 'marca', grid: 'half' },
      { label: 'Capacidad Máxima', key: 'capacidad', grid: 'half' },
      { label: 'Estado del GPS', key: 'gps', grid: 'half' },
      { label: 'Vigencia SOAT', key: 'soat', grid: 'full' },
    ],
  },

  parada: {
    title: 'Información de la Parada',
    icon: 'location_on',
    displayName: 'nombre',
    displayType: 'ciudad',
    fields: [
      { label: 'Nombre', key: 'nombre', grid: 'half' },
      { label: 'Ciudad', key: 'ciudad', grid: 'half' },
      { label: 'Dirección', key: 'direccion', grid: 'full' },
      { label: 'Latitud', key: 'latitud', grid: 'half' },
      { label: 'Longitud', key: 'longitud', grid: 'half' },
    ],
  },

  ruta: {
    title: 'Información de la Ruta',
    icon: 'route',
    displayName: 'nombre',
    displayType: 'sector',
    fields: [
      { label: 'Nombre', key: 'nombre', grid: 'full' },
      { label: 'Sector o Barrio', key: 'sector', grid: 'half' },
      { label: 'Hora Inicio', key: 'horaInicio', grid: 'half' },
      { label: 'Hora Finalización', key: 'horaFin', grid: 'half' },
      { label: 'Lugar Destino', key: 'destino', grid: 'half' },
      { label: 'Sector', key: 'sectorRuta', grid: 'full' },
    ],
  },

  admins: {
    title: 'Información del Administrador',
    icon: 'admin_panel_settings',
    displayName: 'nombre',
    displayType: 'correo',
    fields: [
      { label: 'Nombre', key: 'nombre', grid: 'half' },
      { label: 'Apellidos', key: 'apellidos', grid: 'half' },
      { label: 'Correo Electrónico', key: 'correo', grid: 'full' },
      { label: 'Identificación', key: 'identificacion', grid: 'half' },
      { label: 'Teléfono', key: 'telefono', grid: 'half' },
      { label: 'Fecha Nacimiento', key: 'fechaNac', grid: 'full' },
      { label: 'Dirección', key: 'direccion', grid: 'full' },
    ],
  },

  schools: {
    title: 'Información de la Escuela',
    icon: 'school',
    displayName: 'nombre',
    displayType: 'ciudad',
    fields: [
      { label: 'Nombre', key: 'nombre', grid: 'full' },
      { label: 'Ciudad', key: 'ciudad', grid: 'half' },
      { label: 'Escolaridad', key: 'escolaridad', grid: 'half' },
      { label: 'Dirección', key: 'direccion', grid: 'half' },
      { label: 'Teléfono', key: 'telefono', grid: 'half' },
      { label: 'Correo Electrónico', key: 'correo', grid: 'full' },
      { label: 'Página Web', key: 'web', grid: 'full' },
    ],
  },
};

@Component({
  selector: 'app-record-information',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './record-information.html',
  styleUrl: './record-information.css',
})
export class RecordInformation {
  @Input() type: RegisterType = 'estudiante';
  @Input() record: RecordData = {};

  @Output() closed = new EventEmitter<void>();

  get config(): ModalConfig {
    return MODAL_CONFIGS[this.type];
  }

  get displayName(): string {
    const key = this.config.displayName;
    return key ? ((this.record[key] as string) || 'N/A') : 'N/A';
  }

  get displayType(): string {
    const key = this.config.displayType;
    return key ? ((this.record[key] as string) || '') : '';
  }

  getGridClass(field: FieldConfig): string {
    return field.grid === 'half' ? 'modal__info-item--half' : '';
  }

  getValue(field: FieldConfig): string {
    const value = this.record[field.key];
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return field.format ? field.format(value) : String(value);
  }

  getVisibleFields(): FieldConfig[] {
    return this.config.fields.filter((field) => {
      const value = this.record[field.key];
      return value !== null && value !== undefined && value !== '';
    });
  }

  cerrar(): void {
    this.closed.emit();
  }
}
