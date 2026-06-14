using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.RouteManagement.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class StopController : ACrudController<StopResponseDto, StopRequestDto>
{
    public StopController(ICrudService<StopResponseDto, StopRequestDto, Guid> service) : base(service)
    {
    }
}