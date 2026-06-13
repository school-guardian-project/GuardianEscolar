using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Application.Services;

public class FamilyMemberServiceImpl : ACrudService<FamilyMember, FamilyMemberResponseDto, FamilyMemberRequestDto>
{
    public FamilyMemberServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override FamilyMemberResponseDto UpdatePartial(Guid id, FamilyMemberRequestDto dto)
    {
        var entity = _context.Set<FamilyMember>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.profileId != Guid.Empty && dto.profileId != entity.profileId) entity.profileId = dto.profileId;
        if (dto.familyId != Guid.Empty && dto.familyId != entity.familyId) entity.familyId = dto.familyId;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        
        _context.SaveChanges();
        return _mapper.Map<FamilyMemberResponseDto>(entity);
    }
}