using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.UserManagement.Api.Controller;

[ApiController]
[Route("api/identification-type")]
[Tags("identification-type")]
public class IdentificationTypeController : ControllerBase
{
    private readonly IdentificationTypeService _identificationTypeService;

    public IdentificationTypeController(IdentificationTypeService identificationTypeService)
    {
        _identificationTypeService = identificationTypeService;
    }

    [HttpGet]
    public async Task<ActionResult<List<IdentificationTypeResponseDto>>> FindAll()
    {
        var result = await _identificationTypeService.FindAll();
        return Ok(result);
    }
}