export interface SchoolRequest {
    cityId: string;
    logo: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    theme: string;
}

export interface SchoolResponse extends SchoolRequest {
    status: string;
}