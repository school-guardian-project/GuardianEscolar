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

/**
 * Alta de admin.
 *
 * `schoolId` es el colegio que administra (no una sede): la relación admin↔
 * colegio vive en School.SchoolAdmin. Solo va en el POST; el PUT usa
 * {@link AdminRequestDto}.
 */
export interface CreateAdminRequestDto extends AdminRequestDto {
  schoolId: string;
}

export interface AdminListDto {
  id: string;
  name: string;
  lastName: string;
  identificationNumber: string;
  email: string;
  phone: number;
}

export interface AdminResponseDto extends AdminListDto {
  identificationType: string;
  residenceAddress: string;
  dateBirth: string;
}
