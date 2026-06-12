using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Application.Services;

public class RouteStopServiceImpl : ACrudService<RouteStop, RouteStopResponseDto, RouteStopRequestDto>
{
    public RouteStopServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}