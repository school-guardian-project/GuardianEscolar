import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SchoolListDto, SchoolRequestDto, SchoolResponseDto, SchoolWithCampusesRequestDto, SchoolWithCampusesResponseDto } from '../models/school.model';

@Injectable({
  providedIn: 'root',
})
export class SchoolsService {
  private readonly base = `${environment.apiUrl}/school-management/api/v1/schools`;

  constructor(private http: HttpClient) {}

  list(): Observable<SchoolListDto[]> {
    return this.http.get<SchoolListDto[]>(this.base);
  }

  search(term: string): Observable<SchoolListDto[]> {
    return this.http.get<SchoolListDto[]>(`${this.base}/search?search=${encodeURIComponent(term)}`);
  }

  get(id: string): Observable<SchoolResponseDto> {
    return this.http.get<SchoolResponseDto>(`${this.base}/${id}`);
  }

  create(payload: SchoolRequestDto): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }

  /**
   * Crea el colegio y sus sedes en una sola operación atómica.
   *
   * Preferible a {@link create} + un PUT por sede: si la tercera sede falla, el
   * primero dejaría el colegio publicado sin ella. Los 409 (nombres de sede
   * repetidos) y 400 los devuelve el backend con ProblemDetails.
   */
  createWithCampuses(payload: SchoolWithCampusesRequestDto): Observable<SchoolWithCampusesResponseDto> {
    return this.http.post<SchoolWithCampusesResponseDto>(`${this.base}/with-campuses`, payload);
  }

  update(id: string, payload: SchoolRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
