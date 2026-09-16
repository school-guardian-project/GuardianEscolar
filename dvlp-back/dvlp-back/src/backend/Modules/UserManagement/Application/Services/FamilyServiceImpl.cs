using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Application.Services;

public class FamilyServiceImpl : ACrudService<Family, FamilyResponseDto, FamilyRequestDto>
{
    public FamilyServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override FamilyResponseDto UpdatePartial(Guid id, FamilyRequestDto dto)
    {
        var entity = _context.Set<Family>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (!string.IsNullOrEmpty(dto.name) && dto.name != entity.name) entity.name = dto.name;
        if (!string.IsNullOrEmpty(dto.observations) && dto.observations != entity.observations) entity.observations = dto.observations;
        
        _context.SaveChanges();
        return _mapper.Map<FamilyResponseDto>(entity);
    }
}