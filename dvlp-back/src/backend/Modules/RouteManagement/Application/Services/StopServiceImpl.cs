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

    public override StopResponseDto UpdatePartial(Guid id, StopRequestDto dto)
    {
        var entity = _context.Set<Stop>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.cityId != Guid.Empty && dto.cityId != entity.cityId) entity.cityId = dto.cityId;
        if (dto.schoolId != Guid.Empty && dto.schoolId != entity.schoolId) entity.schoolId = dto.schoolId;
        if (!string.IsNullOrEmpty(dto.address) && dto.address != entity.address) entity.address = dto.address;
        if (dto.longitude.HasValue && dto.longitude.Value != entity.longitude) entity.longitude = dto.longitude.Value;
        if (dto.latitude.HasValue && dto.latitude.Value != entity.latitude) entity.latitude = dto.latitude.Value;

        _context.SaveChanges();
        return _mapper.Map<StopResponseDto>(entity);
    }
}