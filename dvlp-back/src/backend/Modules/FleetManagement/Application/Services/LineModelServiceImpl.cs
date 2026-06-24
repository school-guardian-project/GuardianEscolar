using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Application.Services;

public class LineModelServiceImpl : ACrudService<LineModel, LineModelResponseDto, LIneModelRequestDto>
{
    public LineModelServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override LineModelResponseDto UpdatePartial(Guid id, LIneModelRequestDto dto)
    {
        var entity = _context.Set<LineModel>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.lineId != Guid.Empty && dto.lineId != entity.lineId) entity.lineId = dto.lineId;
        if (dto.modelId != Guid.Empty && dto.modelId != entity.modelId) entity.modelId = dto.modelId;
        if (dto.capacity.HasValue && dto.capacity.Value != entity.capacity) entity.capacity = dto.capacity.Value;
        if (!string.IsNullOrEmpty(dto.plate) && dto.plate != entity.plate) entity.plate = dto.plate;
        
        _context.SaveChanges();
        return _mapper.Map<LineModelResponseDto>(entity);
    }
}