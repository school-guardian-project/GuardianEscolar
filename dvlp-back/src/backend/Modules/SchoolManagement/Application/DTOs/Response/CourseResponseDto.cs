using backend.Modules.SchoolManagement.Application.DTOs.Request;

namespace backend.Modules.SchoolManagement.Application.DTOs.Response;

public class CourseResponseDto : CourseRequestDto
{
    public Guid id { get; set; }
    public string status { get; set; }
}