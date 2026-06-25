import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { PersonRequest, PersonResponse } from "@core/models/user-management/person.model";

@Injectable({ providedIn: 'root' })
export class PersonService {
    constructor(private api: ApiService) {}

    getAll() {
        return this.api.getAll<PersonResponse>('person')
    }

    getById(id: string) {
        return this.api.getById<PersonResponse>('person', id)
    }

    create(data: PersonRequest) {
        return this.api.create<PersonResponse, PersonRequest>('person', data)
    }

    update(id: string, data: PersonRequest) {
        return this.api.update<PersonResponse, PersonRequest>('person', data, id)
    }

    updatePartial(id: string, data: Partial<PersonRequest>) {
        return this.api.update<PersonResponse, Partial<PersonRequest>>('person', data, id)
    }

    delete(id: string) {
        return this.api.delete('person', id)
    }

    deletePartial(id: string) {
        return this.api.deletePartial('person', id)
    }
}