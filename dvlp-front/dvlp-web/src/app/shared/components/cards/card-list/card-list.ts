import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type CardType =
  | 'estudiante'
  | 'acudiente'
  | 'conductor'
  | 'familia'
  | 'bus'
  | 'parada'
  | 'ruta'
  | 'admins'
  | 'schools';

// Campos que se muestran en cada item de la lista
export interface ItemField {
  key: string;        // nombre del campo en el objeto de datos
  label?: string;     // etiqueta opcional (si no se pone, solo muestra el valor)
  halfWidth?: boolean; // va en fila de dos
}

// Icono del avatar por tipo
const ICONS: Record<CardType, string> = {
  estudiante: 'person',
  acudiente: 'escalator_warning',
  conductor: 'engineering',
  familia: 'family_restroom',
  bus: 'directions_bus',
  parada: 'location_on',
  ruta: 'route',
  schools: 'school',
  admins: 'admin_panel_settings',
};

const TITLES: Record<CardType, string> = {
  estudiante: 'Estudiantes registrados',
  acudiente: 'Acudientes registrados',
  conductor: 'Conductores registrados',
  familia: 'Familias registradas',
  bus: 'Buses registrados',
  parada: 'Paradas registradas',
  ruta: 'Rutas registradas',
  admins: 'Administradores registrados',
  schools: 'Escuelas registradas',
};

// Qué campos muestra cada item en la lista
const ITEM_FIELDS: Record<CardType, ItemField[]> = {
  estudiante: [
    { key: 'nombre' },
    { key: 'identificacion' },
    { key: 'curso', halfWidth: true },
    { key: 'telefono', halfWidth: true },
  ],
  acudiente: [
    { key: 'nombre' },
    { key: 'identificacion' },
    { key: 'telefono' },
  ],
  conductor: [
    { key: 'nombre' },
    { key: 'identificacion' },
    { key: 'licencia', label: 'Licencia vigente', halfWidth: true },
    { key: 'telefono', halfWidth: true },
  ],
  familia: [
    { key: 'nombre' },
    { key: 'acudiente', label: 'Acudiente' },
    { key: 'telefono' },
  ],
  bus: [
    { key: 'matricula', label: 'Placa' },
    { key: 'conductor', label: 'Nombre conductor' },
    { key: 'marca', halfWidth: true },
    { key: 'modelo', halfWidth: true },
  ],
  parada: [
    { key: 'nombre' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'latitud', halfWidth: true },
    { key: 'longitud', halfWidth: true },
  ],
  ruta: [
    { key: 'nombre' },
    { key: 'destino', label: 'Destino final' },
    { key: 'horaInicio', label: 'Hora inicio', halfWidth: true },
    { key: 'horaFin', label: 'Hora final', halfWidth: true },
  ],
  admins: [
    { key: 'nombre' },
    { key: 'identificacion' },
    { key: 'correo', label: 'Correo electrónico', halfWidth: true },
    { key: 'telefono', halfWidth: true },
  ],
  schools: [
    { key: 'nombre' },
    { key: 'direccion', label: 'Dirección' },
  ],
};

// Datos de ejemplo hardcodeados para cada tipo
const MOCK_DATA: Record<CardType, any[]> = {
  estudiante: [
    { nombre: 'Nombre completo', identificacion: 'Identificación', curso: 'Curso', telefono: '+57 *** *** ****' },
    { nombre: 'Nombre completo', identificacion: 'Identificación', curso: 'Curso', telefono: '+57 *** *** ****' },
    { nombre: 'Nombre completo', identificacion: 'Identificación', curso: 'Curso', telefono: '+57 *** *** ****' },
    { nombre: 'Nombre completo', identificacion: 'Identificación', curso: 'Curso', telefono: '+57 *** *** ****' },
  ],
  acudiente: [
    { nombre: 'Nombre completo', identificacion: 'Identificación', telefono: '+57 *** *** ****' },
    { nombre: 'Nombre completo', identificacion: 'Identificación', telefono: '+57 *** *** ****' },
    { nombre: 'Nombre completo', identificacion: 'Identificación', telefono: '+57 *** *** ****' },
  ],
  conductor: [
    { nombre: 'Nombre completo', identificacion: 'Identificación', licencia: 'Licencia vigente', telefono: '+57 xxx xxx xxxx' },
    { nombre: 'Nombre completo', identificacion: 'Identificación', licencia: 'Licencia vigente', telefono: '+57 xxx xxx xxxx' },
  ],
  familia: [
    { nombre: 'Nombre', acudiente: 'Acudiente', telefono: 'xxx xxx xxxx' },
    { nombre: 'Nombre', acudiente: 'Acudiente', telefono: 'xxx xxx xxxx' },
  ],
  bus: [
    { matricula: 'Placa', conductor: 'Nombre conductor', marca: 'Marca', modelo: 'Modelo' },
    { matricula: 'Placa', conductor: 'Nombre conductor', marca: 'Marca', modelo: 'Modelo' },
  ],
  parada: [
    { nombre: 'Nombre', direccion: 'Dirección', latitud: 'Latitud', longitud: 'Longitud' },
    { nombre: 'Nombre', direccion: 'Dirección', latitud: 'Latitud', longitud: 'Longitud' },
  ],
  ruta: [
    { nombre: 'Nombre', destino: 'Destino final', horaInicio: 'Hora inicio', horaFin: 'Hora final' },
    { nombre: 'Nombre', destino: 'Destino final', horaInicio: 'Hora inicio', horaFin: 'Hora final' },
  ],
  schools: [
    { nombre: 'Nombre', direccion: 'Dirección' },
    { nombre: 'Nombre', direccion: 'Dirección' },
  ],
  admins: [
    { nombre: 'Nombre completo', identificacion: 'Identificación', correo: 'Correo electrónico', telefono: 'Teléfono' },
    { nombre: 'Nombre completo', identificacion: 'Identificación', correo: 'Correo electrónico', telefono: 'Teléfono' },
  ],
};

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
})
export class CardList {
  @Input() type: CardType = 'estudiante';

  searchText = '';

  get title(): string {
    return TITLES[this.type];
  }

  get icon(): string {
    return ICONS[this.type];
  }

  get itemFields(): ItemField[] {
    return ITEM_FIELDS[this.type];
  }

  get items(): any[] {
    return MOCK_DATA[this.type];
  }

  // Devuelve los campos normales (no halfWidth) del item
  get mainFields(): ItemField[] {
    return this.itemFields.filter(f => !f.halfWidth);
  }

  // Agrupa los halfWidth en parejas
  get rowFields(): [ItemField, ItemField][] {
    const half = this.itemFields.filter(f => f.halfWidth);
    const rows: [ItemField, ItemField][] = [];
    for (let i = 0; i < half.length; i += 2) {
      if (half[i + 1]) rows.push([half[i], half[i + 1]]);
    }
    return rows;
  }
}