export type BusStatus = 'Active' | 'Inactive';

/**
 * Contrato real de ms-fleet (BusController):
 * - POST /fleet/api/buses  { campuseId, soatValidity, gpsDeviceId, capacity, plate, modelId } → Ok(busId)
 * - PUT  /fleet/api/buses/{id} { campuseId, soatValidity, capacity, modelId }
 *
 * El `status` no viaja en los requests: el backend lo fija en `Active` al crear
 * y no hay ruta de cambio de estado en el controlador. `gpsDeviceId` es
 * opcional porque no existe listado de dispositivos GPS en el backend (ver
 * toCreatePayload en la página de buses).
 */
export interface BusRequestDto {
  campuseId: string;
  soatValidity: string;
  gpsDeviceId?: string;
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
  capacity: number;
  modelId: number;
  status: BusStatus;
}