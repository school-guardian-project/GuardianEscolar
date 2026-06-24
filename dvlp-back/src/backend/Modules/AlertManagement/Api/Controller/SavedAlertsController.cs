using backend.Modules.AlertManagement.Application.DTOs.Request;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.AlertManagement.Api.Controller;

[ApiController]
[Route("api/saved-alerts")]
public class SavedAlertsController :ACrudController<SavedAlertsResponseDto, SavedAlertsRequestDto>
{
    public SavedAlertsController(ICrudService<SavedAlertsResponseDto, SavedAlertsRequestDto, Guid> service) : base(service)
    {
    }
}