export interface LineModelRequest {
    lineId: string;
    modelId: string;
    capacity: number;
    plate: string;
}

export interface LineModelResponse extends LineModelRequest {
    status: string;
}