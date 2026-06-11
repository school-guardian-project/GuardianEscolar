using AutoMapper;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;

namespace backend.Modules.SchoolManagement.Application.Mappers;

public class SchoolProfile : Profile
{
    public SchoolProfile()
    {
        CreateMap<SchoolEntity, SchoolResponseDto>();
        CreateMap<SchoolRequestDto, SchoolEntity>();
    }
}