import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { ExceptionalDriverUsageRequest, ExceptionalDriverUsageResponse } from "@core/models/fleet-management/exceptional-driver-usage.model";

@Injectable({ providedIn: 'root' })
export class ExceptionalDriverUsageService extends AbstractCrudService<ExceptionalDriverUsageResponse, ExceptionalDriverUsageRequest> {
    constructor(api: ApiService) {
        super(api, 'exceptional-driver-usage');
    }
}