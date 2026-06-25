namespace backend.Modules.SchoolManagement.Application.DTOs.Request;

public class SchoolCampuseRequestDto
{
    public Guid schoolId { get; set; }

    public string name { get; set; }

    public string address { get; set; }
}