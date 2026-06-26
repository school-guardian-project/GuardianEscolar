import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { StopResponse, StopRquest } from "@core/models/route-management/stop.model";

@Injectable({ providedIn: 'root' })
export class StopService extends AbstractCrudService<StopResponse, StopRquest> {
    constructor(api: ApiService) {
        super(api, 'stop');
    }
}