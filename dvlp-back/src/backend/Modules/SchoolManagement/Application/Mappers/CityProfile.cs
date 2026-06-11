using AutoMapper;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;

namespace backend.Modules.SchoolManagement.Application.Mappers;

public class CityProfile : Profile
{
    public CityProfile()
    {
        CreateMap<City, CityResponseDto>();
    }
}