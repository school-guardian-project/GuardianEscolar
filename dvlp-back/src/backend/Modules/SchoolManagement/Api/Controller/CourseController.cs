using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.SchoolManagement.Api.Controller;

[ApiController]
[Route("api/course")]
[Tags("course")]
public class CourseController : ACrudController<CourseResponseDto, CourseRequestDto>
{
    public CourseController(ICrudService<CourseResponseDto, CourseRequestDto, Guid> service) : base(service)
    {
    }
}