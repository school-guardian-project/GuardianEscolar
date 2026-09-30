import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonListDto } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class ParentsService {
  private readonly base = `${environment.apiUrl}/user/api/parents`;

  constructor(private http: HttpClient) {}

  list(): Observable<PersonListDto[]> {
    return this.http.get<PersonListDto[]>(this.base);
  }
}
