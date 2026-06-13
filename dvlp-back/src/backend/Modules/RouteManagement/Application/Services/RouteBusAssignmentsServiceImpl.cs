using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Application.Services;

public class RouteBusAssignmentsServiceImpl : ACrudService<RouteBusAssignments, RouteBusAssignmentsResponseDto, RouteBusAssignmentsRequestDto>
{
    public RouteBusAssignmentsServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override RouteBusAssignmentsResponseDto UpdatePartial(Guid id, RouteBusAssignmentsRequestDto dto)
    {
        var entity = _context.Set<RouteBusAssignments>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.busId != Guid.Empty && dto.busId != entity.busId) entity.busId = dto.busId;
        if (dto.routeId != Guid.Empty && dto.routeId != entity.routeId) entity.routeId = dto.routeId;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;

        _context.SaveChanges();
        return _mapper.Map<RouteBusAssignmentsResponseDto>(entity);
    }
}