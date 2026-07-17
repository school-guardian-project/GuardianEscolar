export interface CourseRequest {
    name: string;
    campuseId: string;
}

export interface CourseResponse extends CourseRequest {
    id: string
    status: string;
}