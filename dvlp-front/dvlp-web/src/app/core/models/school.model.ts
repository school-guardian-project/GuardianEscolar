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

/**
 * Alta de colegio con sus sedes en una sola llamada.
 *
 * El backend lo hace en una transacción: o se crean el colegio y todas las
 * sedes, o no se crea ninguno. Una llamada a PUT por sede dejaría colegios
 * huérfanos si falla la segunda.
 */
export interface SchoolWithCampusesRequestDto extends SchoolRequestDto {
  /** Nombres de las sedes. La dirección la heredan del colegio. */
  campusNames: string[];
}

export interface SchoolWithCampusesResponseDto {
  id: string;
  name: string;
  campuses: { id: string; name: string; address: string }[];
}

export interface SchoolListDto {
  id: string;
  name: string;
  address: string;
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
}
