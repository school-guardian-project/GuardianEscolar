import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { SchoolRequest, SchoolResponse } from "@core/models/school-management/school.model";

@Injectable({ providedIn: 'root' })
export class SchoolService extends AbstractCrudService<SchoolResponse, SchoolRequest> {
    constructor(api: ApiService) {
        super(api, 'school');
    }
}