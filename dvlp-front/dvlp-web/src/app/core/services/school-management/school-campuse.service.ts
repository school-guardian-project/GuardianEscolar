import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { SchoolCampuseRequest, SchoolCampuseResponse } from "@core/models/school-management/school-campuse.model";

@Injectable({ providedIn: 'root' })
export class SchoolCampuseService extends AbstractCrudService<SchoolCampuseResponse, SchoolCampuseRequest> {
    constructor(api: ApiService) {
        super(api, 'school-campuse');
    }
}