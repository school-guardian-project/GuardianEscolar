export enum IdentificationType {
  TI,
  CC
}

export interface PersonRequestDto {
  name: string;
  lastName: string;
  identificationType: string;
  identificationNumber: string;
  email: string;
  phone: number;
  residenceAddress: string;
  dateBirth: string;
}

export interface PersonListDto {
  id: string;
  name: string;
  lastName: string;
  identificationNumber: string;
  email: string;
  phone: number;
  profileId?: string | null;
  /** Solo conductores: UserManagement.DriverLicense */
  licenseNumber?: string | null;
  licenseExpirationDate?: string | null;
}

export interface PersonResponseDto extends PersonListDto {
  identificationType: IdentificationType;
  residenceAddress: string;
  dateBirth: string;
}
