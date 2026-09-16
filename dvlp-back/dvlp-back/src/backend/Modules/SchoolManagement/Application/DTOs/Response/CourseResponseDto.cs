namespace backend.Modules.SchoolManagement.Application.DTOs.Response;

public class CourseResponseDto
{
    public string? name { get; set; }

    public Guid campuseId { get; set; }
    
    public string status { get; set; }
}