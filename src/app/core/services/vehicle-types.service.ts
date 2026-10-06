import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BrandListDto {
  id: number;
  name: string;
}

export interface ModelListDto {
  id: number;
  name: string;
  brandId: number;
  brandName: string;
}

@Injectable({ providedIn: 'root' })
export class VehicleTypesService {
  private readonly base = `${environment.apiUrl}/fleet/api/vehicle-types`;

  constructor(private http: HttpClient) {}

  listBrands(): Observable<BrandListDto[]> {
    return this.http.get<BrandListDto[]>(`${this.base}/brands`);
  }

  listModels(brandId?: number): Observable<ModelListDto[]> {
    let params = new HttpParams();
    if (brandId !== undefined) {
      params = params.set('brandId', brandId.toString());
    }
    return this.http.get<ModelListDto[]>(`${this.base}/models`, { params });
  }
}
