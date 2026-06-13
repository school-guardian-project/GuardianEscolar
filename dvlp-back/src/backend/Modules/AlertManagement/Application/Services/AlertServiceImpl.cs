using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.AlertManagement.Application.DTOs.Request;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Modules.AlertManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.AlertManagement.Application.Services;

public class AlertServiceImpl : ACrudService<Alert, AlertResponseDto, AlertRequestDto>
{
    public AlertServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override AlertResponseDto UpdatePartial(Guid id, AlertRequestDto dto)
    {
        var entity = _context.Set<Alert>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.alertTypeId != Guid.Empty) entity.alertTypeId = dto.alertTypeId;
        if (dto.busId != Guid.Empty) entity.busId = dto.busId;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        
        _context.SaveChanges();
        return _mapper.Map<AlertResponseDto>(entity);
    }
}