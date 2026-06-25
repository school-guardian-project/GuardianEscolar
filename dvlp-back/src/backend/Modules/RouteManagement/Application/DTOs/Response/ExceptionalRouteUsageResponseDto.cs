using backend.Modules.RouteManagement.Application.DTOs.Request;

namespace backend.Modules.RouteManagement.Application.DTOs.Response;

public class ExceptionalRouteUsageResponseDto : ExceptionalRouteUsageRequestDto
{
    public DateTime dateTime { get; set; }
    
    public string status { get; set; }
}