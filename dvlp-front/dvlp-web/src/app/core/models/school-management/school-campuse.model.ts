export interface SchoolCampuseRequest {
    schoolId: string;
    name: string;
    address: string;
}

export interface SchoolCampuseResponse extends SchoolCampuseRequest {
    status: string;
}