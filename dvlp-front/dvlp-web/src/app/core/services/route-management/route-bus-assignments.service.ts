import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { RouteBusAssignmentsRequest, RouteBusAssignmentsResponse } from "@core/models/route-management/route-bus-assignments.model";

@Injectable({ providedIn: 'root' })
export class RouteBusAssignmentsService extends AbstractCrudService<RouteBusAssignmentsResponse, RouteBusAssignmentsRequest> {
    constructor(api: ApiService) {
        super(api, 'route-bus-assignments');
    }
}