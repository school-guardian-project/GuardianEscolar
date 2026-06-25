using backend.Modules.RouteManagement.Application.DTOs.Request;

namespace backend.Modules.RouteManagement.Application.DTOs.Response;

public class RouteBusAssignmentsResponseDto : RouteBusAssignmentsRequestDto
{
    public string status { get; set; }
}