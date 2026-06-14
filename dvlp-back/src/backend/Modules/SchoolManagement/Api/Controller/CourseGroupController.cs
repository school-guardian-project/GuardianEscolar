using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.SchoolManagement.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class CourseGroupController : ACrudController<CourseGroupResponseDto, CourseGroupRequestDto>
{
    public CourseGroupController(ICrudService<CourseGroupResponseDto, CourseGroupRequestDto, Guid> service) : base(service)
    {
    }
}