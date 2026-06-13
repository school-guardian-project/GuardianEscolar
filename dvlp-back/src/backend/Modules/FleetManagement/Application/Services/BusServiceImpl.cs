using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Application.Services;

public class BusServiceImpl : ACrudService<Bus, BusResponseDto, BusRequestDto>
{
    public BusServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override BusResponseDto UpdatePartial(Guid id, BusRequestDto dto)
    {
        var entity = _context.Set<Bus>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.driverId != Guid.Empty && dto.driverId != entity.driverId) entity.driverId = dto.driverId;
        if (dto.schoolId != Guid.Empty && dto.schoolId != entity.schoolId) entity.schoolId = dto.schoolId;
        if (dto.lineModelId != Guid.Empty && dto.lineModelId != entity.lineModelId) entity.lineModelId = dto.lineModelId;
        if (dto.soatValidity != null && !dto.soatValidity.SequenceEqual(entity.soatValidity)) entity.soatValidity = dto.soatValidity;
        if (dto.gpsStatus.HasValue && dto.gpsStatus.Value != entity.gpsStatus) entity.gpsStatus = dto.gpsStatus.Value;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        
        _context.SaveChanges();
        return _mapper.Map<BusResponseDto>(entity);
    }
}