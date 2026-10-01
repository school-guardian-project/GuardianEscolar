export type RelationshipType = 'Parent' | 'Student';

export interface FamilyMemberDto {
  profileId: string;
  relationshipType: RelationshipType;
}

export interface FamilyListDto {
  id: string;
  name: string;
  parentProfileId: string | null;
}

export interface FamilyResponseDto extends FamilyListDto {
  description: string;
  children: string[];
}

export interface FamilyRequestDto {
  familyName: string;
  observations: string;
  members: FamilyMemberDto[];
}
