using backend.Modules.AlertManagement.Application.DTOs.Request;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.AlertManagement.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class AlertController : ACrudController<AlertResponseDto, AlertRequestDto>
{
    public AlertController(ICrudService<AlertResponseDto, AlertRequestDto, Guid> service) : base(service)
    {
    }
}