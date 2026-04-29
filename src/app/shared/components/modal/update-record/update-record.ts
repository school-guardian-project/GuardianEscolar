import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

export interface Field {
  label: string;
  name: string;
  type: 'text' | 'date' | 'select' | 'tel' | 'email' | 'file';
  placeholder?: string;
  options?: string[];
  halfWidth?: boolean;
}

// ─── Modal header config ─────────────────────────────────────────────────────
interface ModalConfig {
  title: string;
  icon: string;
  displayName?: string;
  displayType?: string;
}

// ─── Fields por tipo (igual que card-register, sin 'file') ───────────────────
const UPDATE_FIELDS: Record<RegisterType, Field[]> = {
  estudiante: [
    { label: 'Nombres',              name: 'nombres',        type: 'text' },
    { label: 'Apellidos',            name: 'apellidos',      type: 'text' },
    { label: 'Tipo Identificación',  name: 'tipoId',         type: 'select', options: ['CC', 'TI', 'CE', 'Pasaporte', 'Registro Civil'] },
    { label: 'Identificación',       name: 'identificacion', type: 'text' },
    { label: 'Fecha nacimiento',     name: 'fechaNac',       type: 'date' },
    { label: 'Curso',                name: 'curso',          type: 'select', options: ['1°','2°','3°','4°','5°','6°','7°','8°','9°','10°','11°'], halfWidth: true },
    { label: 'Teléfono',             name: 'telefono',       type: 'tel',    halfWidth: true },
    { label: 'Dirección residencia', name: 'direccion',      type: 'text' },
    { label: 'Correo electrónico',   name: 'correo',         type: 'email' },
  ],
  acudiente: [
    { label: 'Nombre',               name: 'nombre',         type: 'text' },
    { label: 'Apellidos',            name: 'apellidos',      type: 'text' },
    { label: 'Correo electrónico',   name: 'correo',         type: 'email' },
    { label: 'Tipo Identificación',  name: 'tipoId',         type: 'select', options: ['CC', 'CE', 'Pasaporte'] },
    { label: 'Identificación',       name: 'identificacion', type: 'text' },
    { label: 'Fecha nacimiento',     name: 'fechaNac',       type: 'date' },
    { label: 'Teléfono',             name: 'telefono',       type: 'tel' },
    { label: 'Dirección residencia', name: 'direccion',      type: 'text' },
  ],
  conductor: [
    { label: 'Nombres',              name: 'nombres',        type: 'text' },
    { label: 'Apellidos',            name: 'apellidos',      type: 'text' },
    { label: 'Tipo Identificación',  name: 'tipoId',         type: 'select', options: ['CC', 'CE', 'Pasaporte'] },
    { label: 'Identificación',       name: 'identificacion', type: 'text' },
    { label: 'Fecha nacimiento',     name: 'fechaNac',       type: 'date' },
    { label: 'Vencimiento licencia', name: 'vencLicencia',   type: 'date',  halfWidth: true },
    { label: 'Licencia conducción',  name: 'licencia',       type: 'text',  halfWidth: true },
    { label: 'Dirección residencia', name: 'direccion',      type: 'text' },
    { label: 'Correo electrónico',   name: 'correo',         type: 'email' },
  ],
  familia: [
    { label: 'Nombre',               name: 'nombre',         type: 'text' },
    { label: 'Acudiente',            name: 'acudiente',      type: 'select', options: [] },
    { label: 'Estudiante',           name: 'estudiante',     type: 'select', options: [] },
    { label: 'Observaciones',        name: 'observaciones',  type: 'text' },
  ],
  bus: [
    { label: 'Matrícula del bus',    name: 'matricula',      type: 'text' },
    { label: 'Conductor',            name: 'conductor',      type: 'select', options: [] },
    { label: 'Modelo',               name: 'modelo',         type: 'text' },
    { label: 'Marca',                name: 'marca',          type: 'text' },
    { label: 'Capacidad máxima',     name: 'capacidad',      type: 'text' },
    { label: 'Vigencia SOAT',        name: 'soat',           type: 'date',  halfWidth: true },
    { label: 'Estado del GPS',       name: 'gps',            type: 'select', options: ['Activo', 'Inactivo', 'En revisión'], halfWidth: true },
  ],
  parada: [
    { label: 'Nombre',               name: 'nombre',         type: 'text' },
    { label: 'Ciudad',               name: 'ciudad',         type: 'select', options: [] },
    { label: 'Dirección',            name: 'direccion',      type: 'text' },
    { label: 'Latitud',              name: 'latitud',        type: 'text' },
    { label: 'Longitud',             name: 'longitud',       type: 'text' },
  ],
  ruta: [
    { label: 'Nombre',                    name: 'nombre',     type: 'text' },
    { label: 'Sector o barrio',           name: 'sector',     type: 'text' },
    { label: 'Hora de inicio de la ruta', name: 'horaInicio', type: 'text', placeholder: 'HH:MM' },
    { label: 'Hora finalización de ruta', name: 'horaFin',    type: 'text', placeholder: 'HH:MM' },
    { label: 'Lugar destino',             name: 'destino',    type: 'text' },
    { label: 'Sector',                    name: 'sectorRuta', type: 'select', options: [] },
  ],
  admins: [
    { label: 'Nombre',               name: 'nombre',         type: 'text' },
    { label: 'Apellidos',            name: 'apellidos',      type: 'text' },
    { label: 'Correo electrónico',   name: 'correo',         type: 'email' },
    { label: 'Identificación',       name: 'identificacion', type: 'text' },
    { label: 'Fecha nacimiento',     name: 'fechaNac',       type: 'date' },
    { label: 'Teléfono',             name: 'telefono',       type: 'tel' },
    { label: 'Dirección residencia', name: 'direccion',      type: 'text' },
  ],
  schools: [
    { label: 'Nombre',               name: 'nombre',         type: 'text' },
    { label: 'Ciudad',               name: 'ciudad',         type: 'select', halfWidth: true, options: ['Neiva', 'Medellín', 'Bogotá', 'Cali'] },
    { label: 'Dirección',            name: 'direccion',      type: 'text',   halfWidth: true },
    { label: 'Teléfono',             name: 'telefono',       type: 'tel',    halfWidth: true },
    { label: 'Escolaridad',          name: 'escolaridad',    type: 'select', halfWidth: true, options: ['Primaria', 'Bachillerato', 'Primaria y Bachillerato'] },
    { label: 'Correo electrónico',   name: 'correo',         type: 'email' },
    { label: 'Página web',           name: 'web',            type: 'text' },
  ],
};

const MODAL_CONFIGS: Record<RegisterType, ModalConfig> = {
  estudiante: { title: 'Actualizar Estudiante',     icon: 'person',               displayName: 'nombres',   displayType: 'curso' },
  acudiente:  { title: 'Actualizar Acudiente',      icon: 'people',               displayName: 'nombre',    displayType: 'tipoId' },
  conductor:  { title: 'Actualizar Conductor',      icon: 'directions_car',       displayName: 'nombres',   displayType: 'licencia' },
  familia:    { title: 'Actualizar Familia',        icon: 'home',                 displayName: 'nombre',    displayType: 'acudiente' },
  bus:        { title: 'Actualizar Bus',            icon: 'directions_bus',       displayName: 'matricula', displayType: 'marca' },
  parada:     { title: 'Actualizar Parada',         icon: 'location_on',          displayName: 'nombre',    displayType: 'ciudad' },
  ruta:       { title: 'Actualizar Ruta',           icon: 'route',                displayName: 'nombre',    displayType: 'sector' },
  admins:     { title: 'Actualizar Administrador',  icon: 'admin_panel_settings', displayName: 'nombre',    displayType: 'correo' },
  schools:    { title: 'Actualizar Escuela',        icon: 'school',               displayName: 'nombre',    displayType: 'ciudad' },
};

@Component({
  selector: 'app-update-record',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './update-record.html',
  styleUrl: './update-record.css',
})
export class UpdateRecord implements OnInit {
  @Input() type: RegisterType = 'estudiante';
  @Input() record: RecordData = {};

  @Output() saved  = new EventEmitter<RecordData>();
  @Output() closed = new EventEmitter<void>();

  formData: Record<string, string> = {};
  groupedFields: Array<Field | [Field, Field]> = [];

  // ── Config header ──────────────────────────────────────────────────────────
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

  // ── Ciclo de vida ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Pre-rellena el formulario con los valores actuales del registro
    UPDATE_FIELDS[this.type].forEach(f => {
      const val = this.record[f.name];
      this.formData[f.name] = val !== null && val !== undefined ? String(val) : '';
    });
    this.groupedFields = this.buildGroupedFields();
  }

  private buildGroupedFields(): Array<Field | [Field, Field]> {
    const result: Array<Field | [Field, Field]> = [];
    const list = UPDATE_FIELDS[this.type];
    let i = 0;
    while (i < list.length) {
      if (list[i].halfWidth && list[i + 1]?.halfWidth) {
        result.push([list[i], list[i + 1]]);
        i += 2;
      } else {
        result.push(list[i]);
        i++;
      }
    }
    return result;
  }

  // ── Type guards y helpers para el template ────────────────────────────────
  isArray(val: Field | [Field, Field]): val is [Field, Field] {
    return Array.isArray(val);
  }

  /** Castea a tupla para acceder por índice en el template sin *ngLet */
  asArray(val: Field | [Field, Field]): [Field, Field] {
    return val as [Field, Field];
  }

  /** Castea a Field individual para el template sin *ngLet */
  asField(val: Field | [Field, Field]): Field {
    return val as Field;
  }

  // ── Acciones ───────────────────────────────────────────────────────────────
  onSubmit(): void {
    const updated: RecordData = { ...this.record, ...this.formData };
    this.saved.emit(updated);
  }

  cerrar(): void {
    this.closed.emit();
  }
}