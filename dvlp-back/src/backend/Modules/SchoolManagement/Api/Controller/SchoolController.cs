using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.SchoolManagement.Api.Controller;

[ApiController]
[Route("api/school")]
public class SchoolController : ACrudController<SchoolResponseDto, SchoolRequestDto>
{
    public SchoolController(ICrudService<SchoolResponseDto, SchoolRequestDto, Guid> service) : base(service)
    {
    }
}