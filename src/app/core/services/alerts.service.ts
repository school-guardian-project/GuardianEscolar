import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  routeId: string;
  routeName: string;
  alertType: 'BOARDING' | 'ALIGHTING' | 'INCIDENT' | 'DELAY' | 'DEVIATION';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  stopName?: string;
  stopAddress?: string;
  latitude?: number;
  longitude?: number;
}

export interface AlertsResponse {
  content: Alert[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AlertFilters {
  page?: number;
  size?: number;
  sort?: string;
  alertType?: string;
  acknowledged?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private readonly base = `${environment.apiUrl}/api/v1/alerts`;

  constructor(private http: HttpClient) {}

  getAlerts(filters: AlertFilters = {}): Observable<AlertsResponse> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '0')
      .set('size', filters.size?.toString() ?? '10')
      .set('sort', filters.sort ?? 'timestamp,desc');

    if (filters.alertType) params = params.set('alertType', filters.alertType);
    if (filters.acknowledged !== undefined) params = params.set('acknowledged', filters.acknowledged.toString());
    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get<AlertsResponse>(this.base, { params });
  }

  acknowledgeAlert(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/acknowledge`, {});
  }

  getAlertById(id: string): Observable<Alert> {
    return this.http.get<Alert>(`${this.base}/${id}`);
  }
}