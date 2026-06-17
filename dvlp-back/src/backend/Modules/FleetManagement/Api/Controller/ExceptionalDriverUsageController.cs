using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.FleetManagement.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class ExceptionalDriverUsageController : ACrudController<ExceptionalDriverResponseDto, ExceptionalDriverUsageRequestDto>
{
    public ExceptionalDriverUsageController(ICrudService<ExceptionalDriverResponseDto, ExceptionalDriverUsageRequestDto, Guid> service) : base(service)
    {
    }
}