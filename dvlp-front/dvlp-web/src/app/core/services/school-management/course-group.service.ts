import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { CourseGroupRequest, CourseGroupResponse } from "@core/models/school-management/course-group.model";

@Injectable({ providedIn: 'root' })
export class CourseGroupService extends AbstractCrudService<CourseGroupResponse, CourseGroupRequest> {
    constructor(api: ApiService) {
        super(api, 'course-group');
    }
}