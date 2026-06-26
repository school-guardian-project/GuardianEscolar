import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { SavedAlertRequest, SavedALertResponse } from "@core/models/alert-management/saved-alerts.model";

@Injectable({ providedIn: 'root' })
export class SavedAlertService extends AbstractCrudService<SavedALertResponse, SavedAlertRequest> {
    constructor(api: ApiService) {
        super(api, 'saved-alert');
    }
}