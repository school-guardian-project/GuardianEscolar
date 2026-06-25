export interface FamilyMemberRequest {
    familyId: string;
    profileId: string;
}

export interface FamilyMemberResponse extends FamilyMemberRequest {
    status: string;
}