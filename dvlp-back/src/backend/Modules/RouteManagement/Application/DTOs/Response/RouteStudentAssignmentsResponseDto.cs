using backend.Modules.RouteManagement.Application.DTOs.Request;

namespace backend.Modules.RouteManagement.Application.DTOs.Response;

public class RouteStudentAssignmentsResponseDto : RouteStudentAssignmentsRequestDto
{
    public string status { get; set; }
}