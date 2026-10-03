import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { SchoolListDto, SchoolRequestDto, SchoolResponseDto } from '../models/school.model';

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

  update(id: string, payload: SchoolRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
