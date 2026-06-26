import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { LineModelRequest, LineModelResponse } from "@core/models/fleet-management/line-model.model";

@Injectable({ providedIn: 'root' })
export class LineModelService extends AbstractCrudService<LineModelResponse, LineModelRequest> {
    constructor(api: ApiService) {
        super(api, 'line-model');
    }
}