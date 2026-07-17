using backend.Modules.UserManagement.Application.DTOs.Request;

namespace backend.Modules.Security.Application.DTOs.Request;

public class ProfileRequestDto : PersonRequestDto
{
    public string password { get; set; }
}