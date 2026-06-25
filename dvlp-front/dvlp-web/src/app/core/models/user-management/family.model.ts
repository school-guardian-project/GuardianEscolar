export interface FamilyRequest {
    name: string;
    observations: string;
}

export interface FamilyResponse extends FamilyRequest {
    status: string
}