namespace backend.Modules.RouteManagement.Application.DTOs.Response;

public class RouteStopResponseDto
{
    public Guid routeId { get; set; }

    public Guid stopId { get; set; }
    
    public string status { get; set; }
}