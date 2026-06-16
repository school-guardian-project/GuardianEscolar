using backend.Modules.BoardingManagement.Application.DTOs.Request;
using backend.Modules.BoardingManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.BoardingManagement.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class BoardingController : ACrudController<BoardingResponseDto, BoardingRequestDto>
{
    public BoardingController(ICrudService<BoardingResponseDto, BoardingRequestDto, Guid> service) : base(service)
    {
    }
}