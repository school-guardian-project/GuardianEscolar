using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.SchoolManagement.Api.Controller;

[ApiController]
[Route("api/course-group")]
[Tags("course-group")]
public class CourseGroupController : ACrudController<CourseGroupResponseDto, CourseGroupRequestDto>
{
    public CourseGroupController(ICrudService<CourseGroupResponseDto, CourseGroupRequestDto, Guid> service) : base(service)
    {
    }
}