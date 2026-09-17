namespace backend.Modules.UserManagement.Application.DTOs.Response;

public class FamilyMemberResponseDto
{
    public Guid familyId { get; set; }
    
    public Guid profileId { get; set; }
    
    public string status { get; set; }
}