using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.BoardingManagement.Application.DTOs.Request;
using backend.Modules.BoardingManagement.Application.DTOs.Response;
using backend.Modules.BoardingManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.BoardingManagement.Application.Services;

public class BoardingServiceImpl : ACrudService<Boarding, BoardingResponseDto, BoardingRequestDto>
{
    public BoardingServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override BoardingResponseDto UpdatePartial(Guid id, BoardingRequestDto dto)
    {
        var entity = _context.Set<Boarding>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.profileId != Guid.Empty && dto.profileId != entity.profileId) entity.profileId = dto.profileId;
        if (dto.busId != Guid.Empty && dto.busId != entity.busId) entity.busId = dto.busId;
        if (dto.stopId != Guid.Empty && dto.stopId != entity.stopId) entity.stopId = dto.stopId;
        if (dto.action.HasValue && dto.action.Value != entity.action) entity.action = dto.action.Value;
        
        _context.SaveChanges();
        return _mapper.Map<BoardingResponseDto>(entity);
    }
}