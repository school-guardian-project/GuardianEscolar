namespace backend.Modules.RouteManagement.Application.DTOs.RouteBUsAssignmentsDto;

public class RouteBusAssignmentsRequestDto
{
    public Guid busId { get; set; }

    public Guid routeId { get; set; }
}