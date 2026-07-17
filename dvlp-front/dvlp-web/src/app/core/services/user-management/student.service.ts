import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { StudentRequest, StudentResponse } from "@core/models/user-management/student.model";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService extends AbstractCrudService<StudentResponse, StudentRequest> {
    constructor(api: ApiService) {
        super(api, 'student');
    }

    // Peticion post
    create(data: StudentRequest): Observable<StudentResponse> {
        return this.api.create<StudentResponse, StudentRequest>(this.endpoint, data);
    }
}