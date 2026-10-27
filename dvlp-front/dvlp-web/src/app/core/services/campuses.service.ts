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
  status?: 'Active' | 'Inactive';
}

@Injectable({ providedIn: 'root' })
export class CampusesService {
  private readonly base = `${environment.apiUrl}/school-management/api/v1`;

  constructor(private http: HttpClient) {}

  listBySchool(schoolId: string, includeInactive = false): Observable<CampusListDto[]> {
    const url = `${this.base}/schools/${schoolId}/campuses`;
    return this.http.get<CampusListDto[]>(includeInactive ? `${url}?includeInactive=true` : url);
  }

  updateBySchool(schoolId: string, campuses: CampusListDto[]): Observable<void> {
    return this.http.put<void>(`${this.base}/schools/${schoolId}/campuses`, { campuses });
  }
}
