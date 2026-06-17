using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Application.Services;

public class RouteEntityServiceImpl : ACrudService<RouteEntity, RouteEntityResponseDto, RouteEntityRequestDto>
{
    public RouteEntityServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override RouteEntityResponseDto UpdatePartial(Guid id, RouteEntityRequestDto dto)
    {
        var entity = _context.Set<RouteEntity>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.schoolId != Guid.Empty && dto.schoolId != entity.schoolId) entity.schoolId = dto.schoolId;
        if (!string.IsNullOrEmpty(dto.name) && dto.name != entity.name) entity.name = dto.name;
        if (!string.IsNullOrEmpty(dto.targetSector) && dto.targetSector != entity.targetSector) entity.targetSector = dto.targetSector;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;

        _context.SaveChanges();
        return _mapper.Map<RouteEntityResponseDto>(entity);
    }
}