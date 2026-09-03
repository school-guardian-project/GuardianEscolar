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

    public override RouteStopResponseDto UpdatePartial(Guid id, RouteStopRequestDto dto)
    {
        var entity = _context.Set<RouteStop>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.routeId != Guid.Empty && dto.routeId != entity.routeId) entity.routeId = dto.routeId;
        if (dto.stopId != Guid.Empty && dto.stopId != entity.stopId) entity.stopId = dto.stopId;

        _context.SaveChanges();
        return _mapper.Map<RouteStopResponseDto>(entity);
    }
}