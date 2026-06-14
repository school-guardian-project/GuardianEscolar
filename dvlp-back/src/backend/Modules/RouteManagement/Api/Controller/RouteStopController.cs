using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.RouteManagement.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class RouteStopController : ACrudController<RouteStopResponseDto, RouteStopRequestDto>
{
    public RouteStopController(ICrudService<RouteStopResponseDto, RouteStopRequestDto, Guid> service) : base(service)
    {
    }
}