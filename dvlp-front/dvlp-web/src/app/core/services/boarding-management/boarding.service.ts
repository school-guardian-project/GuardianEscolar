import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { BoardingRequest, BoardingResponse } from "@core/models/boarding-management/boarding.model";

@Injectable({ providedIn: 'root' })
export class BoardingService extends AbstractCrudService<BoardingResponse, BoardingRequest> {
    constructor(api: ApiService) {
        super(api, 'boarding');
    }
}