namespace backend.Modules.RouteManagement.Application.DTOs.RouteEntityDto;

public class RouteEntityResponseDto
{
    public Guid schoolId { get; set; }

    public string name { get; set; }

    public string targetSector { get; set; }

    public TimeSpan startTime { get; set; }

    public TimeSpan endTime { get; set; }
}