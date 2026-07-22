import { ProfileRequest } from "./profile.model";

export interface StudentRequest extends ProfileRequest {
    courseId: string;
}

export interface StudentResponse {
    name: string;
    lastName: string;
    identificationNumber: string;
    phone: string;
    courseName: string;
}