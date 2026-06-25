using backend.Modules.UserManagement.Application.DTOs.Request;

namespace backend.Modules.UserManagement.Application.DTOs.Response;

public class FamilyMemberResponseDto : FamilyMemberRequestDto
{
    public string status { get; set; }
}