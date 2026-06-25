namespace backend.Modules.SchoolManagement.Application.DTOs.Request;

public class CourseRequestDto
{
    public string name { get; set; }
    
    public Guid campuseId { get; set; }
}