export type StopStatus = 'Active' | 'Inactive';

export interface StopRequestDto {
  name: string;
  cityId: string;
  schoolId: string;
  address: string;
  longitude: number;
  latitude: number;
  /** Ruta a la que se mueve la parada (PUT): reemplaza el vínculo con previousRouteId. */
  routeId?: string;
  previousRouteId?: string;
}

export interface StopListDto {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cityId: string;
  schoolId: string;
  routeId?: string | null;
  routeName?: string | null;
  routeNames?: string[];
}

export interface StopResponseDto {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cityId: string;
  schoolId: string;
  status: StopStatus;
}
