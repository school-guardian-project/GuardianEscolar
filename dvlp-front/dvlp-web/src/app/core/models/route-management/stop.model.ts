export interface StopRquest {
    cityd: string;
    schoolId: string;
    address: string;
    longitude: string;
    latitude: string
}

export interface StopResponse extends StopRquest {
    status: string;
}