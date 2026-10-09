export interface SchoolRequestDto {
  cityId: string;
  logo: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  phone: number;
  email: string;
  website?: string;
  theme?: string;
}

/**
 * Alta de colegio con sus sedes en una sola llamada.
 *
 * El backend lo hace en una transacción: o se crean el colegio y todas las
 * sedes, o no se crea ninguno. Una llamada a PUT por sede dejaría colegios
 * huérfanos si falla la segunda.
 */
export interface SchoolWithCampusesRequestDto extends SchoolRequestDto {
  campuses: SchoolCampusRequestDto[];
}

export interface SchoolCampusRequestDto {
  id?: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export interface SchoolWithCampusesResponseDto {
  id: string;
  name: string;
  campuses: SchoolCampusRequestDto[];
}

export interface SchoolCampusDto extends SchoolCampusRequestDto {
  id: string;
}

export interface SchoolListDto {
  id: string;
  cityId: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SchoolResponseDto extends SchoolListDto {
  cityId: string;
  cityName: string;
  logo: string;
  phone: number;
  email: string;
  website?: string;
  theme?: string;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
}
