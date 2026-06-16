using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.SchoolManagement.Application.Services;

public class CourseGroupServiceImpl : ACrudService<CourseGroup, CourseGroupResponseDto, CourseGroupRequestDto>
{
    public CourseGroupServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override CourseGroupResponseDto UpdatePartial(Guid id, CourseGroupRequestDto dto)
    {
        var entity = _context.Set<CourseGroup>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.profileId != Guid.Empty && dto.profileId != entity.profileId) entity.profileId = dto.profileId;
        if (dto.courseId != Guid.Empty && dto.courseId != entity.courseId) entity.courseId = dto.courseId;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        
        _context.SaveChanges();
        return _mapper.Map<CourseGroupResponseDto>(entity);
    }
}