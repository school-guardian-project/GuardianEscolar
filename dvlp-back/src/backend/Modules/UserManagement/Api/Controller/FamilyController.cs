using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.UserManagement.Api.Controller;

[ApiController]
[Route("api/family")]
public class FamilyController : ACrudController<FamilyResponseDto, FamilyRequestDto>
{
    public FamilyController(ICrudService<FamilyResponseDto, FamilyRequestDto, Guid> service) : base(service)
    {
    }
}