using backend.Modules.SchoolManagement.Application.DTOs.Request;

namespace backend.Modules.SchoolManagement.Application.DTOs.Response;

public class CourseGroupResponseDto : CourseGroupRequestDto
{
    public string status { get; set; }
}