import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StopListDto, StopRequestDto, StopResponseDto } from '../models/stop.model';

@Injectable({
  providedIn: 'root',
})
export class StopsService {
  private readonly base = `${environment.apiUrl}/route/api/stops`;

  constructor(private http: HttpClient) {}

  list(): Observable<StopListDto[]> {
    return this.http.get<StopListDto[]>(this.base);
  }

  search(term: string): Observable<StopListDto[]> {
    return this.http.get<StopListDto[]>(`${this.base}/search?search=${encodeURIComponent(term)}`);
  }

  get(id: string): Observable<StopResponseDto> {
    return this.http.get<StopResponseDto>(`${this.base}/${id}`);
  }

  create(payload: StopRequestDto): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }

  update(id: string, payload: StopRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
