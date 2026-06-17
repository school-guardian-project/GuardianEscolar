namespace backend.Modules.UserManagement.Application.DTOs.Request;

public class FamilyMemberRequestDto
{
    public Guid familyId { get; set; }

    public Guid profileId { get; set; }
    
    public string status { get; set; }
}