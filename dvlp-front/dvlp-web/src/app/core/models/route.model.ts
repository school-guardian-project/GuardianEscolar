export type RouteStatus = 'Active' | 'Inactive';

export interface RouteRequestDto {
  campuseId: string;
  name: string;
  targetSector: string;
  status: RouteStatus;
}

export interface RouteListDto {
  id: string;
  name: string;
  targetSector: string;
  status: RouteStatus;
}

export interface RouteResponseDto extends RouteListDto {
  campuseId: string;
}
