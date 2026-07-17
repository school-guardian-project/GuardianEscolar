import { PersonRequest } from "./person.model";

export interface ProfileRequest extends PersonRequest {
    password: string;
}