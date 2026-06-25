export interface PersonRequest {
    name: string;
    lastName: string;
    identificationId: string;
    email: string;
    phone: number;
    residenceAddress: string;
    password: string;
    roleId: string
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