namespace backend.Modules.RouteManagement.Application.DTOs.ExceptionalRouteUsageDto;

public class ExceptionalRouteUsageRequestDto
{
    public Guid profileId { get; set; }

    public Guid routeId { get; set; }

    public DateTime dateTime { get; set; }

    public string reason { get; set; }
}