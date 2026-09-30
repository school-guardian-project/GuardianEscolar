export type BusStatus = 'Active' | 'Inactive';

export interface BusRequestDto {
  campuseId: string;
  soatValidity: string;
  gpsDeviceId: string;
  capacity: number;
  plate: string;
  modelId: number;
  status: BusStatus;
}

export interface BusListDto {
  id: string;
  plate: string;
  capacity: number;
  status: BusStatus;
}

export interface BusResponseDto extends BusListDto {
  campuseId: string;
  soatValidity: string;
  gpsDeviceId: string;
  modelId: number;
}
