import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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

export interface Field {
  name: string;
  type: 'text' | 'date' | 'select' | 'tel' | 'email' | 'file';
  placeholder?: string;
  options?: string[];
  halfWidth?: boolean;
}

const FIELDS: Record<RegisterType, Field[]> = {
  estudiante: [
    { name: 'nombres', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'tipoId', type: 'select', options: ['CC', 'TI', 'CE'] },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'curso', type: 'select', options: ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°'], halfWidth: true },
    { name: 'telefono', type: 'tel', halfWidth: true },
    { name: 'direccion', type: 'text' },
    { name: 'correo', type: 'email' },
  ],
  acudiente: [
    { name: 'nombres', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'correo', type: 'email' },
    { name: 'tipoId', type: 'select', options: ['CC','CE'] },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'telefono', type: 'tel' },
    { name: 'direccion', type: 'text' },

  ],

  conductor: [
    { name: 'nombres', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'tipoId', type: 'select', options: ['CC','CE'] },
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
    { name: 'gps', type: 'select', options: ['Activo','Inactivo'], halfWidth: true },
  ],

  parada: [
    { name: 'nombre', type: 'text' },
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
    { name: 'logo', type: 'file' },
    { name: 'ciudad', type: 'select', options: ['Bogotá'] },
    { name: 'direccion', type: 'text' },
    { name: 'telefono', type: 'tel' },
    { name: 'escolaridad', type: 'select', options: ['Primaria'] },
    { name: 'correo', type: 'email' },
    { name: 'web', type: 'text' },
  ],
};


@Component({
  selector: 'app-card-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './card-register.html',
  styleUrl: './card-register.css',
})
export class CardRegister implements OnInit {
  @Input() type: RegisterType = 'estudiante';

  formData: Record<string, any> = {};
  groupedFields: any[] = [];

  get titleKey(): string {
    return `register.${this.type}.title`;
  }

  getLabelKey(name: string): string {
    return `register.${this.type}.fields.${name}`;
  }

  ngOnInit(): void {
    this.groupedFields = this.buildGroupedFields();
  }

  private buildGroupedFields() {
    const result: any[] = [];
    const list = FIELDS[this.type];
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

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  onSubmit(): void {
    console.log('Datos del formulario:', this.formData);
    // Aquí iría el servicio de registro
  }
}