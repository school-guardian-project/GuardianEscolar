using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;

namespace backend.Modules.SchoolManagement.Api.Controller;

public class SchoolCampuseController : ACrudController<SchoolCampuseResponseDto, SchoolCampuseRequestDto>
{
    public SchoolCampuseController(ICrudService<SchoolCampuseResponseDto, SchoolCampuseRequestDto, Guid> service) : base(service)
    {
    }
}