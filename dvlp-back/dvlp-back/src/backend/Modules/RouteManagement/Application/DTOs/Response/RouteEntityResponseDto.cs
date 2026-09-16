namespace backend.Modules.RouteManagement.Application.DTOs.Response;

public class RouteEntityResponseDto
{
    public Guid schoolId { get; set; }

    public string name { get; set; }

    public string targetSector { get; set; }

    public TimeSpan startTime { get; set; }

    public TimeSpan endTime { get; set; }
    
    public string status { get; set; }
}