using AutoMapper;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;

namespace backend.Modules.SchoolManagement.Application.Mappers;

public class SchoolCampuseProfile : Profile
{
    public SchoolCampuseProfile()
    {
        CreateMap<SchoolCampuse, SchoolCampuseResponseDto>();
        CreateMap<SchoolCampuseRequestDto, SchoolCampuse>().ForMember(dest => dest.id, opt => opt.Ignore());
    }
}