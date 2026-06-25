export interface AlertRequest {
    alertTypeId: string;
    busIs: string;
}

export interface ALertResponse extends AlertRequest {
    dateTime: string;
}