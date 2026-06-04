namespace backend.Modules.RouteManagement.Application.DTOs.RoutesStopDto;

public class RouteStopRequestDto
{
    public Guid routeId { get; set; }

    public Guid stopId { get; set; }
}