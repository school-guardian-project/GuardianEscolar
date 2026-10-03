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
  campuseId: string;
  driverName: string;
  brand: string;
  model: string;
}

export interface BusResponseDto extends BusListDto {
  soatValidity: string;
  gpsDeviceId: string;
  capacity: number;
  modelId: number;
  status: BusStatus;
}
