import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RouteListDto, RouteRequestDto, RouteResponseDto } from '../models/route.model';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  private readonly base = `${environment.apiUrl}/route/api/routes`;

  constructor(private http: HttpClient) {}

  list(): Observable<RouteListDto[]> {
    return this.http.get<RouteListDto[]>(this.base);
  }

  get(id: string): Observable<RouteResponseDto> {
    return this.http.get<RouteResponseDto>(`${this.base}/${id}`);
  }

  create(payload: RouteRequestDto): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }

  update(id: string, payload: RouteRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
