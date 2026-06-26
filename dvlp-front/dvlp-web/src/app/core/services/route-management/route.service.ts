import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { RouteRequest, RouteResponse } from "@core/models/route-management/route.model";

@Injectable({ providedIn: 'root' })
export class RouteService extends AbstractCrudService<RouteResponse, RouteRequest> {
    constructor(api: ApiService) {
        super(api, 'route');
    }
}