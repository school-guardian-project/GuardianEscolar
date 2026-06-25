using backend.Modules.RouteManagement.Application.DTOs.Request;

namespace backend.Modules.RouteManagement.Application.DTOs.Response;

public class RouteStopResponseDto : RouteStopRequestDto
{
    public string status { get; set; }
}