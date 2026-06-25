export interface RouteRequest {
    schoolId: string;
    name: string;
    targetSector: string;
}

export interface RouteResponse extends RouteRequest {
    startTime: string;
    endTime: string
    status: string;
}