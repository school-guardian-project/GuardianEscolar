import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { FamilyRequest, FamilyResponse } from "@core/models/user-management/family.model";

@Injectable({ providedIn: 'root' })
export class FamilyService extends AbstractCrudService<FamilyResponse, FamilyRequest> {
    constructor(api: ApiService) {
        super(api, 'family');
    }
}