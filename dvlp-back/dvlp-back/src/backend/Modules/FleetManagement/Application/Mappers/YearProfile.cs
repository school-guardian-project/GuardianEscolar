using AutoMapper;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Domain.Entities;

namespace backend.Modules.FleetManagement.Application.Mappers;

public class YearProfile : Profile
{
    public YearProfile()
    {
        CreateMap<Year, YearResponseDto>();
    }
}