import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonListDto, PersonRequestDto, PersonResponseDto } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private readonly base = `${environment.apiUrl}/user/api/students`;

  constructor(private http: HttpClient) {}

  list(): Observable<PersonListDto[]> {
    return this.http.get<PersonListDto[]>(this.base);
  }

  get(id: string): Observable<PersonResponseDto> {
    return this.http.get<PersonResponseDto>(`${this.base}/${id}`);
  }

  create(payload: PersonRequestDto): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }

  update(id: string, payload: PersonRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
