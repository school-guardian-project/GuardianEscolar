using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Application.Services;

public class ExceptionalRouteUsageServiceImpl : ACrudService<ExceptionalRouteUsage, ExceptionalRouteUsageResponseDto, ExceptionalRouteUsageRequestDto>
{
    public ExceptionalRouteUsageServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override ExceptionalRouteUsageResponseDto UpdatePartial(Guid id, ExceptionalRouteUsageRequestDto dto)
    {
        var entity = _context.Set<ExceptionalRouteUsage>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.profileId != Guid.Empty && dto.profileId != entity.profileId) entity.profileId = dto.profileId;
        if (dto.routeId != Guid.Empty && dto.routeId != entity.routeId) entity.routeId = dto.routeId;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        if (!string.IsNullOrEmpty(dto.reason) && dto.reason != entity.reason) entity.reason = dto.reason;
        
        _context.SaveChanges();
        return _mapper.Map<ExceptionalRouteUsageResponseDto>(entity);
    }
}