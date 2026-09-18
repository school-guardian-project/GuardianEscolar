import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CardListDataService } from '@core/api-mock/card-list.data.service';

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
  estudiante: [
    { name: 'nombres', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'tipoId', type: 'select', options: ['CC', 'TI', 'CE'] },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'curso', type: 'select', options: ['1°', '2°', '3°'], halfWidth: true },
    { name: 'telefono', type: 'tel', halfWidth: true },
    { name: 'direccion', type: 'text' },
    { name: 'correo', type: 'email' },
  ],

  // los demás igual, solo con name/type sin label
  acudiente: [
    { name: 'nombre', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'correo', type: 'email' },
    { name: 'tipoId', type: 'select', options: ['CC', 'CE'] },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'telefono', type: 'tel' },
    { name: 'direccion', type: 'text' },
  ],

  conductor: [
    { name: 'nombres', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'tipoId', type: 'select', options: ['CC', 'CE'] },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'vencLicencia', type: 'date', halfWidth: true },
    { name: 'licencia', type: 'text', halfWidth: true },
    { name: 'direccion', type: 'text' },
    { name: 'correo', type: 'email' },
  ],

  familia: [
    { name: 'nombre', type: 'text' },
    { name: 'acudiente', type: 'select', options: [] },
    { name: 'estudiante', type: 'select', options: [] },
    { name: 'observaciones', type: 'text' },
  ],

  bus: [
    { name: 'matricula', type: 'text' },
    { name: 'conductor', type: 'select', options: [] },
    { name: 'modelo', type: 'text' },
    { name: 'marca', type: 'text' },
    { name: 'capacidad', type: 'text' },
    { name: 'soat', type: 'date', halfWidth: true },
    { name: 'gps', type: 'select', options: ['Activo', 'Inactivo'], halfWidth: true },
  ],

  parada: [
    { name: 'nombre', type: 'text' },
    { name: 'estudiante', type: 'select', options: [] },
    { name: 'ciudad', type: 'select', options: [] },
    { name: 'direccion', type: 'text' },
    { name: 'latitud', type: 'text' },
    { name: 'longitud', type: 'text' },
  ],

  ruta: [
    { name: 'nombre', type: 'text' },
    { name: 'sector', type: 'text' },
    { name: 'horaInicio', type: 'text' },
    { name: 'horaFin', type: 'text' },
    { name: 'destino', type: 'text' },
    { name: 'sectorRuta', type: 'select', options: [] },
  ],

  admins: [
    { name: 'nombre', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'correo', type: 'email' },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'telefono', type: 'tel' },
    { name: 'direccion', type: 'text' },
  ],

  schools: [
    { name: 'nombre', type: 'text' },
    { name: 'ciudad', type: 'select', options: ['Bogotá'] },
    { name: 'direccion', type: 'text' },
    { name: 'telefono', type: 'tel' },
    { name: 'escolaridad', type: 'select', options: ['Primaria'] },
    { name: 'correo', type: 'email' },
    { name: 'web', type: 'text' },
  ],
};

const MODAL_CONFIGS: Record<RegisterType, ModalConfig> = {
  estudiante: { icon: 'person', displayName: 'nombres', displayType: 'curso' },
  acudiente: { icon: 'people', displayName: 'nombre', displayType: 'tipoId' },
  conductor: { icon: 'directions_car', displayName: 'nombres', displayType: 'licencia' },
  familia: { icon: 'home', displayName: 'nombre' },
  bus: { icon: 'directions_bus', displayName: 'matricula' },
  parada: { icon: 'location_on', displayName: 'nombre' },
  ruta: { icon: 'route', displayName: 'nombre' },
  admins: { icon: 'admin_panel_settings', displayName: 'nombre' },
  schools: { icon: 'school', displayName: 'nombre' },
};

@Component({
  selector: 'app-update-record',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule],
  templateUrl: './update-record.html',
  styleUrl: './update-record.css',
})
export class UpdateRecord implements OnInit {
  @Input() type: RegisterType = 'estudiante';
  @Input() record: RecordData = {};

  @Output() saved = new EventEmitter<RecordData>();
  @Output() closed = new EventEmitter<void>();

  formData: Record<string, string> = {};
  fields: Field[] = [];
  submitted = false;
  private dataService = inject(CardListDataService);

  get config() {
    return MODAL_CONFIGS[this.type];
  }

  isFieldInvalid(field: Field): boolean {
    if (!this.submitted) return false;
    const v = this.formData[field.name];
    if (v === undefined || v === null || String(v).trim() === '') return true;
    if (field.type === 'email' && v) {
      const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if (!re.test(String(v).toLowerCase())) return true;
    }
    if (field.type === 'tel' && v) {
      const re = /^\+?[0-9\s\-]{7,15}$/;
      if (!re.test(String(v))) return true;
    }
    return false;
  }

  getFieldError(field: Field): string | null {
    const v = this.formData[field.name];
    if (v === undefined || v === null || String(v).trim() === '') return 'Campo requerido';
    if (field.type === 'email') return 'Correo inválido';
    if (field.type === 'tel') return 'Teléfono inválido';
    return null;
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
    if (this.type === 'bus' || this.type === 'parada') this.loadTransportOptions();
  }

  private loadTransportOptions(): void {
    const fieldName = this.type === 'bus' ? 'conductor' : 'estudiante';
    const field = this.fields.find(item => item.name === fieldName);
    if (!field) return;
    const sourceType = this.type === 'bus' ? 'conductor' : 'estudiante';
    this.dataService.getByType(sourceType).subscribe(list => {
      field.options = (list || [])
        .map(item => item.nombre || item.nombres || item.correo || item.id)
        .filter(Boolean);
    });
  }

  getLabelKey(field: Field): string {
    return `update_record.${this.type}.fields.${field.name}`;
  }

  cerrar(): void {
    this.closed.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    const hasInvalid = this.fields.some(f => this.isFieldInvalid(f));
    if (hasInvalid) return;
    this.saved.emit({ ...this.record, ...this.formData });
  }
}