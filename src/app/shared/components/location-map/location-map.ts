import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
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
  imports: [MatIconModule, TranslateModule],
  templateUrl: './location-map.html',
  styleUrl: './location-map.css',
})
export class LocationMap implements AfterViewInit, OnChanges, OnDestroy {
  @Input() address = '';
  @Input() latitude: unknown;
  @Input() longitude: unknown;
  @Output() coordinatesChange = new EventEmitter<{ latitude: number; longitude: number }>();
  @Output() addressChange = new EventEmitter<string>();

  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  private L: typeof import('leaflet') | null = null;
  private map: import('leaflet').Map | null = null;
  private marker: import('leaflet').Marker | null = null;
  private geocodeTimer: ReturnType<typeof setTimeout> | null = null;
  private reverseController: AbortController | null = null;
  private geocodeController: AbortController | null = null;
  private lastResolvedAddress = '';
  mapMessageKey = '';
  locating = false;

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

      marker.on('dragend', () => this.onMarkerDrag());
      map.on('click', (event) => this.moveTo(event.latlng.lat, event.latlng.lng, true));

      this.map = map;
      this.marker = marker;

      this.syncFromInputs();
      if (this.toCoordinate(this.latitude) === null) this.scheduleGeocode(0);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address !== this.lastResolvedAddress) {
      this.lastResolvedAddress = '';
      this.scheduleGeocode(700);
    }
    if (changes['latitude'] || changes['longitude']) this.syncFromInputs();
  }

  ngOnDestroy(): void {
    if (this.geocodeTimer) clearTimeout(this.geocodeTimer);
    this.reverseController?.abort();
    this.geocodeController?.abort();
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

    this.geocodeController?.abort();
    const controller = new AbortController();
    this.geocodeController = controller;
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`;

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Geocoding failed with HTTP ${response.status}`);
        return response.json();
      })
      .then((rows: Array<{ lat: string; lon: string }>) => {
        if (!rows?.length) {
          this.mapMessageKey = 'locationMap.addressNotFound';
          return;
        }
        const lat = Number(rows[0].lat);
        const lng = Number(rows[0].lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          this.mapMessageKey = '';
          this.moveTo(lat, lng, false);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('No se pudo buscar la dirección en el mapa.', error);
        this.mapMessageKey = 'locationMap.geocodeFailed';
      });
  }

  useDeviceLocation(): void {
    if (!navigator.geolocation) {
      this.mapMessageKey = 'locationMap.geolocationUnavailable';
      return;
    }

    this.locating = true;
    this.mapMessageKey = 'locationMap.locating';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.locating = false;
        this.moveTo(position.coords.latitude, position.coords.longitude, true);
      },
      (error) => {
        this.locating = false;
        this.mapMessageKey = error.code === error.PERMISSION_DENIED
          ? 'locationMap.permissionDenied'
          : error.code === error.TIMEOUT
            ? 'locationMap.locationTimeout'
            : 'locationMap.positionUnavailable';
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  private onMarkerDrag(): void {
    this.emitMarkerPosition();
    if (!this.marker) return;
    const position = this.marker.getLatLng();
    void this.reverseGeocode(position.lat, position.lng);
  }

  private syncFromInputs(): void {
    const lat = this.toCoordinate(this.latitude);
    const lng = this.toCoordinate(this.longitude);
    if (lat === null || lng === null || !this.marker || !this.map) return;

    const current = this.marker.getLatLng();
    if (Math.abs(current.lat - lat) < 1e-7 && Math.abs(current.lng - lng) < 1e-7) return;

    this.marker.setLatLng([lat, lng]);
    this.map.setView([lat, lng], 16);
  }

  private moveTo(lat: number, lng: number, resolveAddress: boolean): void {
    if (!this.marker || !this.map) return;
    this.marker.setLatLng([lat, lng]);
    this.map.setView([lat, lng], 16);
    this.emitMarkerPosition();
    if (resolveAddress) void this.reverseGeocode(lat, lng);
  }

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    this.reverseController?.abort();
    const controller = new AbortController();
    this.reverseController = controller;
    this.mapMessageKey = 'locationMap.resolvingAddress';
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}`;

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Reverse geocoding failed with HTTP ${response.status}`);
      const result = await response.json() as { display_name?: string };
      const address = result.display_name?.trim();
      if (!address) {
        this.mapMessageKey = 'locationMap.addressNotFound';
        return;
      }
      this.lastResolvedAddress = address;
      this.mapMessageKey = '';
      this.addressChange.emit(address);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('No se pudo obtener la dirección del punto seleccionado.', error);
      this.mapMessageKey = 'locationMap.reverseGeocodeFailed';
    }
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
