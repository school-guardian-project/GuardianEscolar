using backend.Modules.Security.Application.DTOs.Response;
using backend.Modules.Security.Domain.Entities;
using Profile = AutoMapper.Profile;

namespace backend.Modules.Security.Application.Mappers;

public class RoleProfile : Profile
{
    public RoleProfile()
    {
        CreateMap<Role, RoleResponseDto>();
    }
}