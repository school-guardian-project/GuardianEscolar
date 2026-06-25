export interface BoardingRequest {
    profileId: string;
    busId: string;
    stopId: string;
    action: boolean;
}

export interface BoardingResponse extends BoardingRequest {
    dateTime: string;
}