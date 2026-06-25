export interface ExceptionalRouteUsageRequest {
    profileId: string;
    routeId: string;
    reason: string;
}

export interface ExceptionalRouteUsageRespone extends ExceptionalRouteUsageRequest {
    dateTime: string;
    status: string;
}