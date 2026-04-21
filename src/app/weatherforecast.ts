import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Weatherforecast {
  constructor() {}
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/weatherforecast';

  public obtenerClima() {
    return this.http.get<any>(this.baseUrl);
  }
}
