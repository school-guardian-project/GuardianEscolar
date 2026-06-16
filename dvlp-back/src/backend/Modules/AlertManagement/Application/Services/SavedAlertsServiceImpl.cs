using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.AlertManagement.Application.DTOs.Request;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Modules.AlertManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.AlertManagement.Application.Services;

public class SavedAlertsServiceImpl : ACrudService<SavedAlert, SavedAlertsResponseDto, SavedAlertsRequestDto>
{
    public SavedAlertsServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override SavedAlertsResponseDto UpdatePartial(Guid id, SavedAlertsRequestDto dto)
    {
        var entity = _context.Set<SavedAlert>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.profileId != Guid.Empty) entity.profileId = dto.profileId;
        if (dto.alertId != Guid.Empty) entity.alertId = dto.alertId;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        
        _context.SaveChanges();
        return _mapper.Map<SavedAlertsResponseDto>(entity);
    }
}