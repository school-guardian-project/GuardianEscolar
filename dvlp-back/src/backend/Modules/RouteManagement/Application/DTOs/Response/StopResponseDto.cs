using backend.Modules.RouteManagement.Application.DTOs.Request;

namespace backend.Modules.RouteManagement.Application.DTOs.Response;

public class StopResponseDto : StopRequestDto
{
    public string status { get; set; }
}