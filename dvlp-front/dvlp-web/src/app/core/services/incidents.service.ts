import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Incident {
  id: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  busId: string;
  busPlate: string;
  incidentType: 'DELAY' | 'BREAKDOWN' | 'ACCIDENT' | 'DEVIATION' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  reportedAt: string;
  reportedBy: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface IncidentsResponse {
  content: Incident[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface IncidentFilters {
  page?: number;
  size?: number;
  sort?: string;
  incidentType?: string;
  severity?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  private readonly base = `${environment.apiUrl}/notification/api/v1/incidents`;

  constructor(private http: HttpClient) {}

  getIncidents(filters: IncidentFilters = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '0')
      .set('size', filters.size?.toString() ?? '10')
      .set('sort', filters.sort ?? 'reportedAt,desc');

    if (filters.incidentType) params = params.set('incidentType', filters.incidentType);
    if (filters.severity) params = params.set('severity', filters.severity);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get(this.base, { params });
  }

  resolveIncident(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/resolve`, {});
  }

  getIncidentById(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }
}