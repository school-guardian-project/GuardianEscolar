import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { ExceptionalRouteUsageRequest, ExceptionalRouteUsageRespone } from "@core/models/route-management/exceptional-route-usage.model";

@Injectable({ providedIn: 'root' })
export class ExceptionalRouteUsageService extends AbstractCrudService<ExceptionalRouteUsageRespone, ExceptionalRouteUsageRequest> {
    constructor(api: ApiService) {
        super(api, 'exceptional-route-usage');
    }
}