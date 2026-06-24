using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.RouteManagement.Api.Controller;

[ApiController]
[Route("api/exceptional-route-usage")]
[Tags("exceptional-route-usage")]
public class RouteBusAssignmentsController : ACrudController<RouteBusAssignmentsResponseDto, RouteBusAssignmentsRequestDto>
{
    public RouteBusAssignmentsController(ICrudService<RouteBusAssignmentsResponseDto, RouteBusAssignmentsRequestDto, Guid> service) : base(service)
    {
    }
}