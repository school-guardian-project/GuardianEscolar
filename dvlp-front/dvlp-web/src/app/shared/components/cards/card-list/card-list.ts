import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordData } from '../../modal/record-information/record-information';

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
    {
      nombres: 'Juan Carlos García',
      apellidos: 'López Martínez',
      nombre: 'Juan Carlos García',
      tipoId: 'CC',
      identificacion: '1234567890',
      curso: '9°',
      telefono: '+57 321 456 7890',
      fechaNac: '2010-05-15',
      direccion: 'Calle 5 #12-34',
      correo: 'juan.garcia@school.com'
    },
    {
      nombres: 'María Elena Ruiz',
      apellidos: 'Martínez López',
      nombre: 'María Elena Ruiz',
      tipoId: 'TI',
      identificacion: '9876543210',
      curso: '8°',
      telefono: '+57 312 345 6789',
      fechaNac: '2011-08-22',
      direccion: 'Calle 10 #8-20',
      correo: 'maria.martinez@school.com'
    },
    {
      nombres: 'Carlos Andrés Silva',
      apellidos: 'Rodríguez García',
      nombre: 'Carlos Andrés Silva',
      tipoId: 'CC',
      identificacion: '1111222233',
      curso: '10°',
      telefono: '+57 315 678 9012',
      fechaNac: '2009-12-03',
      direccion: 'Calle 15 #10-40',
      correo: 'carlos.silva@school.com'
    },
    {
      nombres: 'Ana Patricia Gómez',
      apellidos: 'López Jiménez',
      nombre: 'Ana Patricia Gómez',
      tipoId: 'CC',
      identificacion: '4444555566',
      curso: '9°',
      telefono: '+57 318 901 2345',
      fechaNac: '2010-01-20',
      direccion: 'Calle 20 #5-15',
      correo: 'ana.gomez@school.com'
    },
  ],
  acudiente: [
    {
      nombre: 'Rosa María González',
      apellidos: 'García Martínez',
      tipoId: 'CC',
      identificacion: '5555666677',
      telefono: '+57 310 111 2222',
      fechaNac: '1985-03-15',
      direccion: 'Calle 5 #12-34',
      correo: 'rosa.gonzalez@email.com'
    },
    {
      nombre: 'Pedro José López',
      apellidos: 'Rodríguez Silva',
      tipoId: 'CC',
      identificacion: '8888999900',
      telefono: '+57 311 222 3333',
      fechaNac: '1980-07-20',
      direccion: 'Calle 10 #8-20',
      correo: 'pedro.lopez@email.com'
    },
    {
      nombre: 'María Teresa Díaz',
      apellidos: 'Moreno García',
      tipoId: 'CE',
      identificacion: '1112223334',
      telefono: '+57 312 333 4444',
      fechaNac: '1990-05-10',
      direccion: 'Calle 15 #10-40',
      correo: 'maria.diaz@email.com'
    },
  ],
  conductor: [
    {
      nombres: 'Pedro Daniel Rodríguez',
      apellidos: 'Silva García',
      nombre: 'Pedro Daniel Rodríguez',
      tipoId: 'CC',
      identificacion: '54321098',
      licencia: 'C',
      vencLicencia: '2025-12-31',
      telefono: '+57 310 123 4567',
      fechaNac: '1990-07-10',
      direccion: 'Calle 15 #8-90',
      correo: 'pedro.rodriguez@email.com'
    },
    {
      nombres: 'Luis Fernando García',
      apellidos: 'Moreno López',
      nombre: 'Luis Fernando García',
      tipoId: 'CC',
      identificacion: '77778888',
      licencia: 'C',
      vencLicencia: '2026-08-20',
      telefono: '+57 320 234 5678',
      fechaNac: '1988-03-15',
      direccion: 'Calle 25 #12-35',
      correo: 'luis.garcia@email.com'
    },
  ],
  familia: [
    {
      nombre: 'Familia García López',
      acudiente: 'Rosa María González',
      estudiante: 'Juan Carlos García',
      observaciones: 'Familia con 2 hijos en el colegio'
    },
    {
      nombre: 'Familia López Martínez',
      acudiente: 'Pedro José López',
      estudiante: 'María Elena Ruiz',
      observaciones: 'Estudiante becado'
    },
  ],
  bus: [
    {
      matricula: 'CND-2024',
      conductor: 'Pedro Daniel Rodríguez',
      marca: 'Mercedes Benz',
      modelo: '2022',
      capacidad: '45',
      gps: 'Activo',
      soat: '2025-06-30'
    },
    {
      matricula: 'MVL-2023',
      conductor: 'Luis Fernando García',
      marca: 'Chevrolet',
      modelo: '2021',
      capacidad: '48',
      gps: 'Activo',
      soat: '2025-09-15'
    },
  ],
  parada: [
    {
      nombre: 'Parada Centro',
      direccion: 'Carrera 7 #5-40',
      ciudad: 'Neiva',
      latitud: '2.9277',
      longitud: '-75.2892'
    },
    {
      nombre: 'Parada Barrio Sur',
      direccion: 'Calle 50 #10-20',
      ciudad: 'Neiva',
      latitud: '2.9200',
      longitud: '-75.2950'
    },
  ],
  ruta: [
    {
      nombre: 'Ruta Centro - Sur',
      sector: 'Centro',
      horaInicio: '06:30',
      horaFin: '08:00',
      destino: 'Colegio Principal',
      sectorRuta: 'Centro - Barrio Sur'
    },
    {
      nombre: 'Ruta Norte - Este',
      sector: 'Norte',
      horaInicio: '06:45',
      horaFin: '08:15',
      destino: 'Colegio Secundario',
      sectorRuta: 'Norte - Barrio Este'
    },
  ],
  schools: [
    {
      nombre: 'Colegio Técnico Neiva',
      direccion: 'Calle 50 #20-30',
      ciudad: 'Neiva',
      escolaridad: 'Primaria y Bachillerato',
      telefono: '+57 8 876 5432',
      correo: 'info@colegiotecnico.edu.co',
      web: 'www.colegiotecnico.edu.co'
    },
    {
      nombre: 'Instituto Educativo San Jorge',
      direccion: 'Carrera 5 #10-50',
      ciudad: 'Neiva',
      escolaridad: 'Primaria',
      telefono: '+57 8 877 6543',
      correo: 'contacto@sanjorge.edu.co',
      web: 'www.sanjorge.edu.co'
    },
  ],
  admins: [
    {
      nombre: 'Carlos Andrés',
      apellidos: 'Pérez Gómez',
      correo: 'carlos.perez@admin.com',
      identificacion: '11111111',
      telefono: '+57 315 777 8888',
      fechaNac: '1988-09-12',
      direccion: 'Calle 20 #10-50'
    },
    {
      nombre: 'Ana María',
      apellidos: 'Rodríguez Silva',
      correo: 'ana.rodriguez@admin.com',
      identificacion: '22222222',
      telefono: '+57 316 888 9999',
      fechaNac: '1992-06-25',
      direccion: 'Calle 25 #15-60'
    },
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
  @Output() viewItem = new EventEmitter<RecordData>();
  @Output() editItem = new EventEmitter<RecordData>();

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

  showDetails(item: RecordData): void {
    this.viewItem.emit(item);
  }

  editDetails(item: RecordData): void { // ← agregar
    this.editItem.emit(item);
  }
}
