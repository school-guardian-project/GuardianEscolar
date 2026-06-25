export interface DriverLicenseRequest {
    profileId: string;
    licenseNumber: string;
    drivingLicense: string;
    licenseExpirationDate: string;
}

export interface DriverLicenseResponse extends DriverLicenseRequest {
    status: string
}