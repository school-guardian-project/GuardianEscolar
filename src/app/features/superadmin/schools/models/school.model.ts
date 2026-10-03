export interface SchoolRequestDto {
  cityId: string;
  logo: string;
  name: string;
  address: string;
  phone: number;
  email: string;
  website?: string;
  theme?: string;
}

export interface SchoolListDto {
  id: string;
  name: string;
  address: string;
}

export interface SchoolResponseDto extends SchoolListDto {
  cityId: string;
  /** Nombre legible de la ciudad (Geographic.City); lo resuelve ms-school-management. */
  cityName: string;
  logo: string;
  phone: number;
  email: string;
  website?: string;
  theme?: string;
  status: string;
}
