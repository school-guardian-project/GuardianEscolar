import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private baseUrl = `${environment.apiUrl}/api`;

    constructor(private http: HttpClient) {}

    getAll<T>(endpoint: string): Observable<T[]> {
        return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`);
    }

    getById<T>(endpoint: string, id: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
    }

    create<TResponse, TRequest>(endpoint: string, data: TRequest): Observable<TResponse> {
        return this.http.post<TResponse>(`${this.baseUrl}/${endpoint}`, data);
    }

    update<TResponse, TRequest>(endpoint: string, data: TRequest, id: string): Observable<TResponse> {
        return this.http.put<TResponse>(`${this.baseUrl}/${endpoint}/${id}`, data);
    }

    updatePartial<TResponse, TRequest>(endpoint: string, data: TRequest, id: string): Observable<TResponse> {
        return this.http.patch<TResponse>(`${this.baseUrl}/${endpoint}/${id}`, data);
    }

    delete(endpoint: string, id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`);
    }

    deletePartial(endpoint: string, id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${endpoint}/soft/${id}`);
    }
}