namespace backend.Modules.SchoolManagement.Application.DTOs.Response;

public class SchoolCampuseResponseDto
{
    public Guid schoolId { get; set; }

    public string? name { get; set; }

    public string? address { get; set; }
    
    public string status { get; set; }
}