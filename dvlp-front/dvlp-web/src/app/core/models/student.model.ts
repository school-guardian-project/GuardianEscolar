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

/**
 * Alta de student, driver o parent.
 *
 * `campusId` va solo en el POST. El PUT usa {@link PersonRequestDto}: la sede
 * se fija al dar de alta y cambiarla es un traslado, no un simple update — y el
 * backend no lo acepta, así que mandarlo no tendría efecto.
 */
export interface CreatePersonRequestDto extends PersonRequestDto {
  /** Sede de la persona. El backend la valida por gRPC antes de guardar. */
  campusId: string;
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
