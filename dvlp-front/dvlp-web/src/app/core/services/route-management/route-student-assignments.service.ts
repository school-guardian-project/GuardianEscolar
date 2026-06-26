import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { RouteStudentAssignmentsRequest, RouteStudentAssignmentsResponse } from "@core/models/route-management/route-student-assignments.model";

@Injectable({ providedIn: 'root' })
export class RouteStudentAssignmentsService extends AbstractCrudService<RouteStudentAssignmentsResponse, RouteStudentAssignmentsRequest> {
    constructor(api: ApiService) {
        super(api, 'route-student-assignments');
    }
}