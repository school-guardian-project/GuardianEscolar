import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FamilyListDto, FamilyRequestDto, FamilyResponseDto } from '../models/family.model';

@Injectable({
  providedIn: 'root',
})
export class FamiliesService {
  private readonly base = `${environment.apiUrl}/user/api/families`;

  constructor(private http: HttpClient) {}

  list(): Observable<FamilyListDto[]> {
    return this.http.get<FamilyListDto[]>(this.base);
  }

  get(id: string): Observable<FamilyResponseDto> {
    return this.http.get<FamilyResponseDto>(`${this.base}/${id}`);
  }

  create(payload: FamilyRequestDto): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }

  update(id: string, payload: FamilyRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
