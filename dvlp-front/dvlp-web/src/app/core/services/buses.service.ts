import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BusListDto, BusRequestDto, BusResponseDto } from '../models/bus.model';

@Injectable({
  providedIn: 'root',
})
export class BusesService {
  private readonly base = `${environment.apiUrl}/fleet/api/buses`;

  constructor(private http: HttpClient) {}

  list(): Observable<BusListDto[]> {
    return this.http.get<BusListDto[]>(this.base);
  }

  get(id: string): Observable<BusResponseDto> {
    return this.http.get<BusResponseDto>(`${this.base}/${id}`);
  }

  create(payload: BusRequestDto): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }

  update(id: string, payload: BusRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
