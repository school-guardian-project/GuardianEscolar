export type StopStatus = 'Active' | 'Inactive';

export interface StopRequestDto {
  cityId: string;
  schoolId: string;
  address: string;
  longitude: number;
  latitude: number;
  status: StopStatus;
}

export interface StopListDto {
  id: string;
  address: string;
  status: StopStatus;
}

export interface StopResponseDto extends StopListDto {
  cityId: string;
  schoolId: string;
  longitude: number;
  latitude: number;
}
