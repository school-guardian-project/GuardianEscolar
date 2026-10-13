export type BusStatus = 'Active' | 'Inactive';

/**
 * Contrato real de ms-fleet (BusController):
 * - POST /fleet/api/buses  { campuseId, soatValidity, gpsDeviceId, capacity, plate, modelId, gpsStatus } → Ok(busId)
 * - PUT  /fleet/api/buses/{id} { campuseId, soatValidity, capacity, modelId, plate, gpsDeviceId, gpsStatus }
 * - GET  /fleet/api/gps-devices → dispositivos GPS con el bus que los usa.
 */
export interface BusRequestDto {
  campuseId: string;
  soatValidity: string;
  gpsDeviceId?: string;
  /** IMEI de un GPS nuevo: ms-fleet lo registra si no existe. */
  gpsImei?: string;
  gpsStatus?: boolean;
  capacity: number;
  plate: string;
  modelId: number;
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
  gpsImei: string;
  gpsStatus: boolean | null;
  driverProfileId: string | null;
  capacity: number;
  modelId: number;
  status: BusStatus;
}

export interface GpsDeviceDto {
  id: string;
  imei: string;
  gpsStatus: boolean;
  assignedBusId: string | null;
  assignedPlate: string;
}
