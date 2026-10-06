import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  inject,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-location-map',
  standalone: true,
  templateUrl: './location-map.html',
  styleUrl: './location-map.css',
})
export class LocationMap implements AfterViewInit, OnChanges, OnDestroy {
  @Input() address = '';
  @Input() latitude: unknown;
  @Input() longitude: unknown;
  @Output() coordinatesChange = new EventEmitter<{ latitude: number; longitude: number }>();

  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  private L: typeof import('leaflet') | null = null;
  private map: import('leaflet').Map | null = null;
  private marker: import('leaflet').Marker | null = null;
  private geocodeTimer: ReturnType<typeof setTimeout> | null = null;

  get coordinatesLabel(): string {
    const lat = this.toCoordinate(this.latitude);
    const lng = this.toCoordinate(this.longitude);
    return lat === null || lng === null ? '—' : `${lat}, ${lng}`;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    void import('leaflet').then((L) => {
      this.L = L;

      const map = L.map(this.canvas.nativeElement, {
        center: [4.5709, -74.2973],
        zoom: 5,
        scrollWheelZoom: false,
      });

      const marker = L.marker([4.5709, -74.2973], { draggable: true }).addTo(map);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      marker.on('dragend', () => this.emitMarkerPosition());
      map.on('click', (event) => this.moveTo(event.latlng.lat, event.latlng.lng));

      this.map = map;
      this.marker = marker;

      this.syncFromInputs();
      if (this.toCoordinate(this.latitude) === null) this.scheduleGeocode(0);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']) this.scheduleGeocode(700);
    if (changes['latitude'] || changes['longitude']) this.syncFromInputs();
  }

  ngOnDestroy(): void {
    if (this.geocodeTimer) clearTimeout(this.geocodeTimer);
    this.map?.remove();
    this.map = null;
    this.marker = null;
  }

  private scheduleGeocode(delay: number): void {
    if (this.geocodeTimer) clearTimeout(this.geocodeTimer);
    this.geocodeTimer = setTimeout(() => this.geocode(), delay);
  }

  private geocode(): void {
    const address = typeof this.address === 'string' ? this.address.trim() : '';
    if (address.length < 5) return;

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`;

    fetch(url)
      .then((response) => (response.ok ? response.json() : []))
      .then((rows: Array<{ lat: string; lon: string }>) => {
        if (!rows?.length) return;
        const lat = Number(rows[0].lat);
        const lng = Number(rows[0].lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) this.moveTo(lat, lng);
      })
      .catch(() => undefined);
  }

  private syncFromInputs(): void {
    const lat = this.toCoordinate(this.latitude);
    const lng = this.toCoordinate(this.longitude);
    if (lat === null || lng === null || !this.marker || !this.map) return;

    const current = this.marker.getLatLng();
    if (Math.abs(current.lat - lat) < 1e-7 && Math.abs(current.lng - lng) < 1e-7) return;

    this.marker.setLatLng([lat, lng]);
    this.map.setView([lat, lng]);
  }

  private moveTo(lat: number, lng: number): void {
    if (!this.marker || !this.map) return;
    this.marker.setLatLng([lat, lng]);
    this.map.setView([lat, lng]);
    this.emitMarkerPosition();
  }

  private emitMarkerPosition(): void {
    if (!this.marker) return;

    const position = this.marker.getLatLng();
    this.coordinatesChange.emit({
      latitude: Number(position.lat.toFixed(7)),
      longitude: Number(position.lng.toFixed(7)),
    });
  }

  private toCoordinate(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
