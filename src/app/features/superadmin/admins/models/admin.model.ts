export interface AdminRequestDto {
  name: string;
  lastName: string;
  identificationType: string;
  identificationNumber: string;
  email: string;
  phone: number;
  residenceAddress: string;
  dateBirth: string;
}

export interface AdminListDto {
  id: string;
  name: string;
  lastName: string;
  identificationNumber: string;
  phone: number;
}

export interface AdminResponseDto extends AdminListDto {
  identificationType: string;
  email: string;
  residenceAddress: string;
  dateBirth: string;
}
