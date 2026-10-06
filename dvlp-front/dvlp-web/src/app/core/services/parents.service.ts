import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonListDto, PersonRequestDto, CreatePersonRequestDto, PersonResponseDto } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class ParentsService {
  private readonly base = `${environment.apiUrl}/user/api/parents`;

  constructor(private http: HttpClient) {}

  list(): Observable<PersonListDto[]> {
    return this.http.get<PersonListDto[]>(this.base);
  }

  search(term: string): Observable<PersonListDto[]> {
    return this.http.get<PersonListDto[]>(`${this.base}/search?search=${encodeURIComponent(term)}`);
  }

  get(id: string): Observable<PersonResponseDto> {
    return this.http.get<PersonResponseDto>(`${this.base}/${id}`);
  }

  create(payload: CreatePersonRequestDto): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }

  update(id: string, payload: PersonRequestDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
