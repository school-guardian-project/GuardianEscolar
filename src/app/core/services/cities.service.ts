import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CityListDto } from '../models/city.model';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private readonly base = `${environment.apiUrl}/route/api/cities`;

  constructor(private http: HttpClient) {}

  list(): Observable<CityListDto[]> {
    return this.http.get<CityListDto[]>(this.base);
  }
}
