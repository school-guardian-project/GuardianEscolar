using backend.Modules.UserManagement.Application.DTOs.Request;

namespace backend.Modules.UserManagement.Application.DTOs.Response;

public class FamilyResponseDto : FamilyRequestDto
{
    public string status { get; set; }
}