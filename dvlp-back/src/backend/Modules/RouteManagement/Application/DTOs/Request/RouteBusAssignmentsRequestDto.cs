namespace backend.Modules.RouteManagement.Application.DTOs.Request;

public class RouteBusAssignmentsRequestDto
{
    public Guid busId { get; set; }

    public Guid routeId { get; set; }
}