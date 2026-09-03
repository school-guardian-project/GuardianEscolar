using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.UserManagement.Api.Controller;

[ApiController]
[Route("api/family-member")]
[Tags("family-member")]
public class FamilyMemberController : ACrudController<FamilyMemberResponseDto, FamilyMemberRequestDto>
{
    public FamilyMemberController(ICrudService<FamilyMemberResponseDto, FamilyMemberRequestDto, Guid> service) : base(service)
    {
    }
}