import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CampusListDto {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

@Injectable({ providedIn: 'root' })
export class CampusesService {
  private readonly base = `${environment.apiUrl}/school-management/api/v1`;

  constructor(private http: HttpClient) {}

  listBySchool(schoolId: string): Observable<CampusListDto[]> {
    return this.http.get<CampusListDto[]>(`${this.base}/schools/${schoolId}/campuses`);
  }

  updateBySchool(schoolId: string, campuses: CampusListDto[]): Observable<void> {
    return this.http.put<void>(`${this.base}/schools/${schoolId}/campuses`, { campuses });
  }
}
