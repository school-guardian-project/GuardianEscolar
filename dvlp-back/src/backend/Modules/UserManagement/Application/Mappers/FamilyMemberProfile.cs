using AutoMapper;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;

namespace backend.Modules.UserManagement.Application.Mappers;

public class FamilyMemberProfile : Profile
{
    public FamilyMemberProfile()
    {
        CreateMap<FamilyMember, FamilyMemberResponseDto>();
        CreateMap<FamilyMemberRequestDto, FamilyMember>();
    }
}