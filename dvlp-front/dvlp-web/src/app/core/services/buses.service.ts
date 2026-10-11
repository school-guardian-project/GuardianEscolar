import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BusListDto, BusRequestDto, BusResponseDto, GpsDeviceDto } from '../models/bus.model';

@Injectable({
  providedIn: 'root',
})
export class BusesService {
  private readonly base = `${environment.apiUrl}/fleet/api/buses`;

  constructor(private http: HttpClient) {}

  list(): Observable<BusListDto[]> {
    return this.http.get<BusListDto[]>(this.base);
  }

  search(term: string): Observable<BusListDto[]> {
    return this.http.get<BusListDto[]>(`${this.base}/search?search=${encodeURIComponent(term)}`);
  }

  get(id: string): Observable<BusResponseDto> {
    return this.http.get<BusResponseDto>(`${this.base}/${id}`);
  }

  create(payload: BusRequestDto): Observable<string> {
    // El backend responde Ok(busId): el id en crudo, necesario para asignar el
    // conductor justo después del alta.
    return this.http.post<string>(this.base, payload);
  }

  update(id: string, payload: BusRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  assignDriver(busId: string, profileId: string): Observable<void> {
    return this.http.put<void>(`${this.base}/${busId}/driver`, { profileId });
  }

  listGpsDevices(): Observable<GpsDeviceDto[]> {
    return this.http.get<GpsDeviceDto[]>(`${environment.apiUrl}/fleet/api/gps-devices`);
  }

  unassignDriver(busId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${busId}/driver`);
  }
}
