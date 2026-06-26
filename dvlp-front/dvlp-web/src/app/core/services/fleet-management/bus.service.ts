import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { BusRequest, BusResponse } from "@core/models/fleet-management/bus.model";

@Injectable({ providedIn: 'root' })
export class BusService extends AbstractCrudService<BusResponse, BusRequest> {
    constructor(api: ApiService) {
        super(api, 'bus');
    }
}