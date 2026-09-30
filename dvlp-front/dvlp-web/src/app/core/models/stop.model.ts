export type StopStatus = 'Active' | 'Inactive';

export interface StopRequestDto {
  name: string;
  cityId: string;
  schoolId: string;
  address: string;
  longitude: number;
  latitude: number;
}

export interface StopListDto {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
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
  createdAt: string;
  updatedAt: string;
}
