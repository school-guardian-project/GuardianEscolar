export interface RouteStopRequest {
    routeId: string;
    stopId: string;
}

export interface RouteStopResponse extends RouteStopRequest {
    status: string;
}