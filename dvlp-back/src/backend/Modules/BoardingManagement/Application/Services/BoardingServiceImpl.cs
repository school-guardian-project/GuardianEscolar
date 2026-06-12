using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.BoardingManagement.Application.DTOs.Request;
using backend.Modules.BoardingManagement.Application.DTOs.Response;
using backend.Modules.BoardingManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.BoardingManagement.Application.Services;

public class BoardingServiceImpl : ACrudService<Boarding, BoardingResponseDto, BoardingRequestDto>
{
    public BoardingServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}