namespace backend.Modules.RouteManagement.Application.DTOs.Request;

public class RouteStudentAssignmentsRequestDto
{
    public Guid profileId { get; set; }
    
    public Guid routeId { get; set; }
}