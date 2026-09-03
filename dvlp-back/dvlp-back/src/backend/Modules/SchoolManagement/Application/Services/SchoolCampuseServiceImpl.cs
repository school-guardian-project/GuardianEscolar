using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.SchoolManagement.Application.Services;

public class SchoolCampuseServiceImpl : ACrudService<SchoolCampuse, SchoolCampuseResponseDto, SchoolCampuseRequestDto>
{
    public SchoolCampuseServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override SchoolCampuseResponseDto UpdatePartial(Guid id, SchoolCampuseRequestDto dto)
    {
        var entity = _context.Set<SchoolCampuse>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.schoolId != Guid.Empty && dto.schoolId != entity.schoolId) entity.schoolId = dto.schoolId;
        if (!string.IsNullOrEmpty(dto.name) && dto.name != entity.name) entity.name = dto.name;
        if (!string.IsNullOrEmpty(dto.address) && dto.address != entity.address) entity.address = dto.address;
        
        _context.SaveChanges();
        return _mapper.Map<SchoolCampuseResponseDto>(entity);
    }
}