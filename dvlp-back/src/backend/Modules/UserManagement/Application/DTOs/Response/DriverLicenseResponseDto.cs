using backend.Modules.UserManagement.Application.DTOs.Request;

namespace backend.Modules.UserManagement.Application.DTOs.Response;

public class DriverLicenseResponseDto : DriverLicenseRequestDto
{
    public string status { get; set; }
}