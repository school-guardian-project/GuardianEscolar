export interface CourseGroupRequest {
    profileId: string;
    courseId: string;
}

export interface CourseGroupResponse extends CourseGroupRequest {
    status: string;
}