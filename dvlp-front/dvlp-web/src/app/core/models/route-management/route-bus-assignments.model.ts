export interface RouteBusAssignmentsRequest {
    busId: string;
    routeId: string;
}

export interface RouteBusAssignmentsResponse extends RouteBusAssignmentsRequest {
    status: string;
}