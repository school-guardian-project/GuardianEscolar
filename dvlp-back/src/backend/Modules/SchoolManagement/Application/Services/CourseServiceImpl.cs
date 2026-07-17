using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.SchoolManagement.Application.Services;

public class CourseServiceImpl : ACrudService<Course, CourseResponseDto, CourseRequestDto>
{
    public CourseServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override CourseResponseDto Save(CourseRequestDto dto)
    {
        var result = base.Save(dto);
        _context.SaveChanges();
        return result;
    }

    public override CourseResponseDto UpdatePartial(Guid id, CourseRequestDto dto)
    {
        var entity = _context.Set<Course>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.campuseId != Guid.Empty && dto.campuseId != entity.campuseId) entity.campuseId = dto.campuseId;
        if (!string.IsNullOrEmpty(dto.name) && dto.name != entity.name) entity.name = dto.name;
        
        _context.SaveChanges();
        return _mapper.Map<CourseResponseDto>(entity);
    }
}