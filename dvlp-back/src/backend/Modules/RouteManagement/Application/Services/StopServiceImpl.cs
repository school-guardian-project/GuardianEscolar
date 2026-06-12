using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Application.Services;

public class StopServiceImpl : ACrudService<Stop, StopResponseDto, StopRequestDto>
{
    public StopServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}