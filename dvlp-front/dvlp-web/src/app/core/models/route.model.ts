export type RouteStatus = 'Active' | 'Inactive';

export interface RouteRequestDto {
  campuseId: string;
  name: string;
  targetSector: string;
  startTime: string;
  endTime: string;
}

export interface RouteListDto {
  id: string;
  name: string;
  campuseId: string;
  startTime: string;
  endTime: string;
}

export interface RouteResponseDto {
  id: string;
  name: string;
  campuseId: string;
  targetSector: string;
  startTime: string;
  endTime: string;
  status: RouteStatus;
  createdAt: string;
  updatedAt: string;
}
