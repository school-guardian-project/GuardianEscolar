using backend.Modules.SchoolManagement.Application.DTOs.Request;

namespace backend.Modules.SchoolManagement.Application.DTOs.Response;

public class SchoolCampuseResponseDto : SchoolCampuseRequestDto
{
    public string status { get; set; }
}