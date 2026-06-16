using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.SchoolManagement.Application.Services;

public class SchoolServiceImpl : ACrudService<SchoolEntity, SchoolResponseDto, SchoolRequestDto>
{
    public SchoolServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override SchoolResponseDto UpdatePartial(Guid id, SchoolRequestDto dto)
    {
        var entity = _context.Set<SchoolEntity>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.cityId != Guid.Empty && dto.cityId != entity.cityId) entity.cityId = dto.cityId;
        if (dto.phone.HasValue && dto.phone.Value != entity.phone) entity.phone = dto.phone.Value;
        if (dto.logo != null && !dto.logo.SequenceEqual(entity.logo)) entity.logo = dto.logo;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        if (!string.IsNullOrEmpty(dto.name) && dto.name != entity.name) entity.name = dto.name;
        if (!string.IsNullOrEmpty(dto.address) && dto.address != entity.address) entity.address = dto.address;
        if (!string.IsNullOrEmpty(dto.email) && dto.email != entity.email) entity.email = dto.email;
        if (!string.IsNullOrEmpty(dto.website) && dto.website != entity.website) entity.website = dto.website;
        if (!string.IsNullOrEmpty(dto.theme) && dto.theme != entity.theme) entity.theme = dto.theme;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        
        _context.SaveChanges();
        return _mapper.Map<SchoolResponseDto>(entity);
    }
}