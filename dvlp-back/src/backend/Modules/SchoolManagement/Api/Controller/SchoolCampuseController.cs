using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.SchoolManagement.Api.Controller;

[ApiController]
[Route("api/school-campuse")]
public class SchoolCampuseController : ACrudController<SchoolCampuseResponseDto, SchoolCampuseRequestDto>
{
    public SchoolCampuseController(ICrudService<SchoolCampuseResponseDto, SchoolCampuseRequestDto, Guid> service) : base(service)
    {
    }
}