import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { AlertRequest, ALertResponse } from "@core/models/alert-management/alert.model";

@Injectable({ providedIn: 'root' })
export class AlertService extends AbstractCrudService<ALertResponse, AlertRequest> {
    constructor(api: ApiService) {
        super(api, 'alert');
    }
}