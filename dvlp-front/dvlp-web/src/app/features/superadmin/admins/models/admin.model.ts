export interface AdminRequestDto {
  name: string;
  lastName: string;
  identificationType: string;
  identificationNumber: string;
  email: string;
  phone: number;
  residenceAddress: string;
  dateBirth: string;
  cityId: string;
  schoolId: string;
}

export type CreateAdminRequestDto = AdminRequestDto;

export interface AdminListDto {
  id: string;
  name: string;
  lastName: string;
  identificationNumber: string;
  email: string;
  phone: number;
  cityId: string | null;
  schoolId: string | null;
}

export interface AdminResponseDto extends AdminListDto {
  identificationType: string;
  residenceAddress: string;
  dateBirth: string;
}
