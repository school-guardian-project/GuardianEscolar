namespace backend.Modules.RouteManagement.Application.DTOs.Request;

public class RouteStopRequestDto
{
    public Guid routeId { get; set; }

    public Guid stopId { get; set; }
    
    public string status { get; set; }
}