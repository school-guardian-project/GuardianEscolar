export type RouteStatus = 'Active' | 'Inactive';

export interface RouteRequestDto {
  campuseId: string;
  name: string;
  targetSector: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];  // NUEVO: ["Monday","Tuesday","Wednesday","Thursday","Friday"]
}

export interface RouteListDto {
  id: string;
  name: string;
  campuseId: string;
  targetSector: string;
  startTime: string;
  endTime: string;
  stopsCount: number;
}

export interface RouteResponseDto {
  id: string;
  name: string;
  campuseId: string;
  targetSector: string;
  startTime: string;
  endTime: string;
  status: RouteStatus;
  busId?: string | null;
  bus?: { id: string; plate: string; driverName?: string } | null;
  stops?: RouteStopDetailDto[];
}

export interface RouteStopDetailDto {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  orderSequence: number;
}

export interface StudentRouteStopDto {
  routeId: string;
  studentProfileId: string;
  routeStopId: string;
  stopId: string;
  stopName: string;
}
