import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AdminListDto, AdminRequestDto, AdminResponseDto } from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  private readonly base = `${environment.apiUrl}/user/api/admins`;

  constructor(private http: HttpClient) {}

  list(): Observable<AdminListDto[]> {
    return this.http.get<AdminListDto[]>(this.base);
  }

  get(id: string): Observable<AdminResponseDto> {
    return this.http.get<AdminResponseDto>(`${this.base}/${id}`);
  }

  create(payload: AdminRequestDto): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }

  update(id: string, payload: AdminRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
