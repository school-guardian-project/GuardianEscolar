export interface BusRequest {
    driverId: string;
    schoolId: string;
    soatValidity: string;
    gpsStatus: boolean;
    lineModelId: string;
}

export interface BusResponse extends BusRequest {
    status: string;
}