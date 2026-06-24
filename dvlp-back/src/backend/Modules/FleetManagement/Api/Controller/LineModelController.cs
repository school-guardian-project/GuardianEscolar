using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.FleetManagement.Api.Controller;

[ApiController]
[Route("api/line-model")]
[Tags("line-model")]
public class LineModelController : ACrudController<LineModelResponseDto, LIneModelRequestDto>
{
    public LineModelController(ICrudService<LineModelResponseDto, LIneModelRequestDto, Guid> service) : base(service)
    {
    }
}