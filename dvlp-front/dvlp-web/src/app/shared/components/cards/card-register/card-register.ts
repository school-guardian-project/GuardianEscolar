import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  label: string;
  name: string;
  type: 'text' | 'date' | 'select' | 'tel' | 'email' | 'file';
  acceppt?: 'image/*';
  placeholder?: string;
  options?: string[];
  halfWidth?: boolean;
  hasButton?: boolean;
}

const FIELDS: Record<RegisterType, Field[]> = {

  estudiante: [
    { label: 'Nombres',              name: 'nombres',        type: 'text' },
    { label: 'Apellidos',            name: 'apellidos',      type: 'text' },
    { label: 'Tipo Identificación',  name: 'tipoId',         type: 'select', options: ['CC', 'TI', 'CE', 'Pasaporte', 'Registro Civil'] },
    { label: 'Identificación',       name: 'identificacion', type: 'text' },
    { label: 'Fecha nacimiento',     name: 'fechaNac',       type: 'date' },
    { label: 'Curso',                name: 'curso',          type: 'select', options: ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°'], halfWidth: true },
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
    { label: 'Vencimiento licencia', name: 'vencLicencia',   type: 'date',   halfWidth: true },
    { label: 'Licencia conducción',  name: 'licencia',       type: 'text',   halfWidth: true, hasButton: true },
    { label: 'Dirección residencia', name: 'direccion',      type: 'text' },
    { label: 'Correo electrónico',   name: 'correo',         type: 'email' },
  ],

  familia: [
    { label: 'Nombre',               name: 'nombre',         type: 'text' },
    { label: 'Acudiente',            name: 'acudiente',      type: 'select', options: [], hasButton: true },
    { label: 'Estudiante',           name: 'estudiante',     type: 'select', options: [], hasButton: true },
    { label: 'Observaciones',        name: 'observaciones',  type: 'text' },
  ],

  bus: [
    { label: 'Matrícula del bus',    name: 'matricula',      type: 'text' },
    { label: 'Conductor',            name: 'conductor',      type: 'select', options: [] },
    { label: 'Modelo',               name: 'modelo',         type: 'text' },
    { label: 'Marca',                name: 'marca',          type: 'text' },
    { label: 'Capacidad máxima',     name: 'capacidad',      type: 'text' },
    { label: 'Vigencia SOAT',        name: 'soat',           type: 'date',   halfWidth: true, hasButton: true },
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
    { label: 'Logo',                 name: 'Logo',           type: 'file', acceppt: 'image/*'},
    { label: 'Ciudad',               name: 'ciudad',         type: 'select', halfWidth: true, options: ['Neiva', 'Medellín', 'Bogotá', 'Cali'] },
    { label: 'Dirección',            name: 'direccion',      type: 'text', halfWidth: true },
    { label: 'Telefono',             name: 'telefono',       type: 'tel', halfWidth: true },
    { label: 'Escolaridad',          name: 'escolaridad',    type: 'select', halfWidth: true, options: ['Primaria', 'Bachillerato', 'Primaria y Bachillerato'] },
    { label: 'Correo Electronico',   name: 'correo',         type: 'text'},
    { label: 'Pagina web',           name: 'web',            type: 'text' },
    
  ],

};

const TITLES: Record<RegisterType, string> = {
  estudiante: 'Registrar estudiante',
  acudiente:  'Registrar acudientes',
  conductor:  'Registrar conductores',
  familia:    'Registrar familias',
  bus:        'Registrar buses',
  parada:     'Registrar paradas',
  ruta:       'Registrar ruta',
  admins:     'Registrar administradores',
  schools:    'Registrar escuelas',
};

@Component({
  selector: 'app-card-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-register.html',
  styleUrl: './card-register.css',
})
export class CardRegister implements OnInit {
  @Input() type: RegisterType = 'estudiante';

  formData: Record<string, string> = {};
  groupedFields: Array<Field | [Field, Field]> = []; //  ya no es getter

  get title(): string {
    return TITLES[this.type];
  }

  ngOnInit(): void {
    this.groupedFields = this.buildGroupedFields(); //  se calcula solo una vez
  }

  private buildGroupedFields(): Array<Field | [Field, Field]> {
    const result: Array<Field | [Field, Field]> = [];
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

  isArray(val: Field | [Field, Field]): val is [Field, Field] {
    return Array.isArray(val);
  }

  onSubmit(): void {
    console.log(`[${this.type}] Datos:`, this.formData);
  }
}
