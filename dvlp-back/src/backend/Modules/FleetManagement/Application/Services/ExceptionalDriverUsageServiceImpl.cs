using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Application.Services;

public class ExceptionalDriverUsageServiceImpl : ACrudService<ExceptionalDriverUsage, ExceptionalDriverResponseDto, ExceptionalDriverUsageRequestDto>
{
    public ExceptionalDriverUsageServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override ExceptionalDriverResponseDto UpdatePartial(Guid id, ExceptionalDriverUsageRequestDto dto)
    {
        var entity = _context.Set<ExceptionalDriverUsage>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.profileId != Guid.Empty && dto.profileId != entity.profileId) entity.profileId = dto.profileId;
        if (dto.busId != Guid.Empty && dto.busId != entity.busId) entity.busId = dto.busId;
        if (!string.IsNullOrEmpty(dto.reason) && dto.reason != entity.reason) entity.reason = dto.reason;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        
        _context.SaveChanges();
        return _mapper.Map<ExceptionalDriverResponseDto>(entity);
    }
}