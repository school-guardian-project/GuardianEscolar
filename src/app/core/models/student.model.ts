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
  phone: number;
}

export interface PersonResponseDto extends PersonListDto {
  identificationType: IdentificationType;
  email: string;
  residenceAddress: string;
  dateBirth: string;
}
