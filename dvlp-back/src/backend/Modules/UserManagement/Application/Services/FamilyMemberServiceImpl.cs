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
}