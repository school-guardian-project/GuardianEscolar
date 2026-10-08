import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfileDto {
  profileId: string;
  personId: string;
  email: string;
  roleId: number;
  roleName: string;
  campusId: string | null;
  campusName: string | null;
  schoolId: string | null;
  schoolName: string | null;
  name: string;
  lastName: string;
  status: string;
  cityName: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly base = `${environment.apiUrl}/api/v1/auth`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.base}/profile`);
  }
}
