namespace backend.Modules.RouteManagement.Application.DTOs.Request;

public class RouteEntityRequestDto
{
    public Guid schoolId { get; set; }

    public string? name { get; set; }

    public string? targetSector { get; set; }
    
    public string status { get; set; }
}