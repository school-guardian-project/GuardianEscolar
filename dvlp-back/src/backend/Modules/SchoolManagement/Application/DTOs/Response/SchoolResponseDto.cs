using backend.Modules.SchoolManagement.Application.DTOs.Request;

namespace backend.Modules.SchoolManagement.Application.DTOs.Response;

public class SchoolResponseDto : SchoolRequestDto
{
    public string status { get; set; }
}