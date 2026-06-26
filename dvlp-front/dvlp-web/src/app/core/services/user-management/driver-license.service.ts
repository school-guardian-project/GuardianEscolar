import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AbstractCrudService } from "../abstract-crud.service";
import { DriverLicenseRequest, DriverLicenseResponse } from "@core/models/user-management/driver-license.model";

@Injectable({ providedIn: 'root' })
export class DriverLicenseService extends AbstractCrudService<DriverLicenseResponse, DriverLicenseRequest> {
    constructor(api: ApiService) {
        super(api, 'driver-license');
    }
}