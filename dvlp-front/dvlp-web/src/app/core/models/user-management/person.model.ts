export interface PersonRequest {
    name: string;
    lastName: string;
    identificationId: string;
    identificationNumber: string;
    email: string;
    phone: number;
    residenceAddress: string;
}

export interface PersonResponse {
    name: string;
    lastName: string;
    identificationId: string;
    email: string;
    phone: number;
    residenceAddress: string;
    roleId: string
    status: string;
}