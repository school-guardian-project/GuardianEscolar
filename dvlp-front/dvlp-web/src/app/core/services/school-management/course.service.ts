import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { CourseRequest, CourseResponse } from "@core/models/school-management/course.model";

@Injectable({ providedIn: 'root' })
export class CourseService extends AbstractCrudService<CourseResponse, CourseRequest> {
    constructor(api: ApiService) {
        super(api, 'course');
    }
}