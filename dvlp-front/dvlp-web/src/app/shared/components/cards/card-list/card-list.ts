import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordData } from '@shared/components/modal/record-information/record-information.types';
import { TranslateModule } from '@ngx-translate/core';

export type CardType =
  | 'estudiante' | 'acudiente' | 'conductor' | 'familia'
  | 'bus' | 'parada' | 'ruta' | 'admins' | 'schools';

export interface ItemField {
  key: string;
  label?: string;          
  labelKey?: string;        
  halfWidth?: boolean;
}

// Iconos
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

// Claves de traducción para títulos
const TITLE_KEYS: Record<CardType, string> = {
  estudiante: 'card_list.estudiante',
  acudiente: 'card_list.acudiente',
  conductor: 'card_list.conductor',
  familia: 'card_list.familia',
  bus: 'card_list.bus',
  parada: 'card_list.parada',
  ruta: 'card_list.ruta',
  admins: 'card_list.admins',
  schools: 'card_list.schools',
};

// Campos a mostrar (con claves de traducción)
const ITEM_FIELDS: Record<CardType, ItemField[]> = {
  estudiante: [
    { key: 'nombre' },
    { key: 'identificacion' },
    { key: 'telefono' },
  ],
  acudiente: [
    { key: 'nombre' },
    { key: 'identificacion' },
    { key: 'telefono' },
  ],
  conductor: [
    { key: 'nombre' },
    { key: 'identificacion' },
    { key: 'licencia', labelKey: 'card_list.labels.licencia_vigente', halfWidth: true },
    { key: 'telefono', halfWidth: true },
  ],
  familia: [
    { key: 'nombre' },
    { key: 'acudiente', labelKey: 'card_list.labels.acudiente' },
    { key: 'telefono' },
  ],
  bus: [
    { key: 'matricula', labelKey: 'card_list.labels.placa' },
    { key: 'conductor', labelKey: 'card_list.labels.nombre_conductor' },
    { key: 'marca', halfWidth: true },
    { key: 'modelo', halfWidth: true },
  ],
  parada: [
    { key: 'nombre' },
    { key: 'direccion', labelKey: 'card_list.labels.direccion' },
    { key: 'latitud', halfWidth: true },
    { key: 'longitud', halfWidth: true },
  ],
  ruta: [
    { key: 'nombre' },
    { key: 'destino', labelKey: 'card_list.labels.destino_final' },
    { key: 'horaInicio', labelKey: 'card_list.labels.hora_inicio', halfWidth: true },
    { key: 'horaFin', labelKey: 'card_list.labels.hora_final', halfWidth: true },
  ],
  admins: [
    { key: 'nombre' },
    { key: 'identificacion' },
    { key: 'correo', labelKey: 'card_list.labels.correo_electronico', halfWidth: true },
    { key: 'telefono', halfWidth: true },
  ],
  schools: [
    { key: 'nombre' },
    { key: 'direccion', labelKey: 'card_list.labels.direccion' },
  ],
};

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, TranslateModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
})
export class CardList {
  @Input() type: CardType = 'estudiante';
  /** Datos externos; si es null la lista queda vacía. */
  @Input() data: any[] | null = null;

  @Output() viewItem = new EventEmitter<RecordData>();
  @Output() editItem = new EventEmitter<RecordData>();
  @Output() deleteItem = new EventEmitter<RecordData>();

  searchText = '';

  get titleKey(): string {
    return TITLE_KEYS[this.type];
  }

  get icon(): string {
    return ICONS[this.type];
  }

  get itemFields(): ItemField[] {
    return ITEM_FIELDS[this.type];
  }

  get items(): any[] {
    return this.data ?? [];
  }

  get filteredItems(): any[] {
    if (!this.searchText?.trim()) return this.items;
    const term = this.searchText.toLowerCase().trim();
    return this.items.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(term)
      )
    );
  }

  get rowFields(): [ItemField, ItemField][] {
    const half = this.itemFields.filter(f => f.halfWidth);
    const rows: [ItemField, ItemField][] = [];
    for (let i = 0; i < half.length; i += 2) {
      if (half[i + 1]) rows.push([half[i], half[i + 1]]);
    }
    return rows;
  }

  showDetails(item: RecordData): void { this.viewItem.emit(item); }
  editDetails(item: RecordData): void { this.editItem.emit(item); }
  deleteDetails(item: RecordData): void { this.deleteItem.emit(item); }
}