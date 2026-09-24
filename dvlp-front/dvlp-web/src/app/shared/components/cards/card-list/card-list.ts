import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordData } from '@shared/components/modal/record-information/record-information.types';
import { TranslateModule } from '@ngx-translate/core';

export type CardType =
  | 'student' | 'guardian' | 'driver' | 'family'
  | 'bus' | 'stop' | 'route' | 'admins' | 'schools';

export interface ItemField {
  key: string;
  label?: string;          
  labelKey?: string;        
  halfWidth?: boolean;
}

// Iconos
const ICONS: Record<CardType, string> = {
  student: 'person',
  guardian: 'escalator_warning',
  driver: 'engineering',
  family: 'family_restroom',
  bus: 'directions_bus',
  stop: 'location_on',
  route: 'route',
  schools: 'school',
  admins: 'admin_panel_settings',
};

// Claves de traducción para títulos
const TITLE_KEYS: Record<CardType, string> = {
  student: 'card_list.student',
  guardian: 'card_list.guardian',
  driver: 'card_list.driver',
  family: 'card_list.family',
  bus: 'card_list.bus',
  stop: 'card_list.stop',
  route: 'card_list.route',
  admins: 'card_list.admins',
  schools: 'card_list.schools',
};

// Campos a mostrar (con claves de traducción)
const ITEM_FIELDS: Record<CardType, ItemField[]> = {
  student: [
    { key: 'name' },
    { key: 'identification' },
    { key: 'phone' },
  ],
  guardian: [
    { key: 'name' },
    { key: 'identification' },
    { key: 'phone' },
  ],
  driver: [
    { key: 'name' },
    { key: 'identification' },
    { key: 'licenseNumber', labelKey: 'card_list.labels.validLicense', halfWidth: true },
    { key: 'phone', halfWidth: true },
  ],
  family: [
    { key: 'name' },
    { key: 'guardian', labelKey: 'card_list.labels.guardian' },
    { key: 'phone' },
  ],
  bus: [
    { key: 'plate', labelKey: 'card_list.labels.plate' },
    { key: 'driver', labelKey: 'card_list.labels.driverName' },
    { key: 'brand', halfWidth: true },
    { key: 'model', halfWidth: true },
  ],
  stop: [
    { key: 'name' },
    { key: 'address', labelKey: 'card_list.labels.address' },
    { key: 'latitud', halfWidth: true },
    { key: 'longitud', halfWidth: true },
  ],
  route: [
    { key: 'name' },
    { key: 'destination', labelKey: 'card_list.labels.finalDestination' },
    { key: 'startTime', labelKey: 'card_list.labels.startTime', halfWidth: true },
    { key: 'endTime', labelKey: 'card_list.labels.endTime', halfWidth: true },
  ],
  admins: [
    { key: 'name' },
    { key: 'identification' },
    { key: 'email', labelKey: 'card_list.labels.email', halfWidth: true },
    { key: 'phone', halfWidth: true },
  ],
  schools: [
    { key: 'name' },
    { key: 'address', labelKey: 'card_list.labels.address' },
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
  @Input() type: CardType = 'student';
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