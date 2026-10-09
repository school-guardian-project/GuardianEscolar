import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordData } from '@shared/components/modal/record-information/record-information.types';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

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
    { key: 'latitude', halfWidth: true },
    { key: 'longitude', halfWidth: true },
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
export class CardList implements OnInit, OnDestroy, OnChanges {
  @Input() type: CardType = 'student';
  /** Datos externos; si es null la lista queda vacía. */
  @Input() data: any[] | null = null;
  @Input() remoteSearch = false;

  @Output() viewItem = new EventEmitter<RecordData>();
  @Output() editItem = new EventEmitter<RecordData>();
  @Output() deleteItem = new EventEmitter<RecordData>();
  @Output() search = new EventEmitter<string>();

  searchText = '';
  readonly pageSize = 10;
  currentPage = 1;
  totalRecords = 0;
  searchSubject = new Subject<string>();

  private searchSubscription?: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (!this.searchText.trim()) this.totalRecords = this.items.length;
      this.currentPage = Math.min(this.currentPage, this.totalPages);
    }
    if (changes['type']) this.currentPage = 1;
  }

  onSearchChange(term: string): void {
    this.searchText = term;
    this.currentPage = 1;
    this.searchSubject.next(term);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
  }

  get pagedItems(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  get firstRecord(): number {
    return this.filteredItems.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get lastRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredItems.length);
  }

  get pageNumbers(): number[] {
    const pages = new Set([1, this.totalPages]);
    for (let page = Math.max(1, this.currentPage - 1); page <= Math.min(this.totalPages, this.currentPage + 1); page++) {
      pages.add(page);
    }
    return [...pages].sort((a, b) => a - b);
  }

  goToPage(page: number): void {
    if (Number.isInteger(page) && page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => this.search.emit(term));
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

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
    if (this.remoteSearch) return this.items;
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