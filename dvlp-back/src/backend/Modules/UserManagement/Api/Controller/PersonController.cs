using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.UserManagement.Api.Controller;

[ApiController]
[Route("api/person")]
[Tags("person")]
public class PersonController : ACrudController<PersonResponseDto, PersonRequestDto>
{
    public PersonController(ICrudService<PersonResponseDto, PersonRequestDto, Guid> service) : base(service)
    {
    }
}