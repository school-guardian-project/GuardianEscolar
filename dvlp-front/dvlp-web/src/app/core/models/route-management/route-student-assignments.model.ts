export interface RouteStudentAssignmentsRequest {
    profileId: string;
    routeId: string;
}

export interface RouteStudentAssignmentsResponse extends RouteStudentAssignmentsRequest {
    status: string;
}