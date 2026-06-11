namespace backend.Modules.RouteManagement.Application.DTOs.Request;

public class ExceptionalRouteUsageRequestDto
{
    public Guid profileId { get; set; }

    public Guid routeId { get; set; }

    public DateTime dateTime { get; set; }

    public string reason { get; set; }
    
    public string status { get; set; }
}