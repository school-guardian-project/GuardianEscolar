export interface ExceptionalDriverUsageRequest {
    profileId: string;
    busId: string;
    reason: string;
}

export interface ExceptionalDriverUsageResponse extends ExceptionalDriverUsageRequest {
    status: string;
    startDateTime: string;
    endDateTime: string;
}