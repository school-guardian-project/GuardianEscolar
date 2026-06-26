import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { PersonRequest, PersonResponse } from "@core/models/user-management/person.model";
import { AbstractCrudService } from "../abstract-crud.service";
import { FamilyMemberRequest, FamilyMemberResponse } from "@core/models/user-management/family-member.model";

@Injectable({ providedIn: 'root' })
export class FamilyMemberService extends AbstractCrudService<FamilyMemberResponse, FamilyMemberRequest> {
    constructor(api: ApiService) {
        super(api, 'family-member');
    }
}