using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.RouteManagement.Api.Controller;

[ApiController]
[Route("api/route-student-assignments")]
[Tags("route-student-assignments")]
public class RouteStudentAssignmentsController : ACrudController<RouteStudentAssignmentsResponseDto, RouteStudentAssignmentsRequestDto>
{
    public RouteStudentAssignmentsController(ICrudService<RouteStudentAssignmentsResponseDto, RouteStudentAssignmentsRequestDto, Guid> service) : base(service)
    {
    }
}