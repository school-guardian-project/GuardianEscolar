import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { RouteStopRequest, RouteStopResponse } from "@core/models/route-management/route-stop.model";

@Injectable({ providedIn: 'root' })
export class RouteStopService extends AbstractCrudService<RouteStopResponse, RouteStopRequest> {
    constructor(api: ApiService) {
        super(api, 'route-stop');
    }
}