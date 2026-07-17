import { ApiService } from "./api.service";
import { Observable } from 'rxjs';

export abstract class AbstractCrudService<TResponse, TRequest = TResponse> {
    constructor(protected api: ApiService, protected endpoint: string) {}

    getAll(): Observable<TResponse[]> {
        return this.api.getAll<TResponse>(this.endpoint)
    }

    getById(id: string): Observable<TResponse> {
        return this.api.getById<TResponse>(this.endpoint, id)
    }

    save(data: TRequest): Observable<TResponse> {
        return this.api.create<TResponse, TRequest>(this.endpoint, data)
    }

    update(id: string, data: TRequest): Observable<TResponse> {
        return this.api.update<TResponse, TRequest>(this.endpoint, data, id)
    }

    updatePartial(id: string, data: Partial<TRequest>): Observable<TResponse> {
        return this.api.update<TResponse, Partial<TRequest>>(this.endpoint, data, id)
    }

    delete(id: string) {
        return this.api.delete(this.endpoint, id)
    }

    deletePartial(id: string) {
        return this.api.deletePartial(this.endpoint, id)
    }
}