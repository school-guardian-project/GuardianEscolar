using AutoMapper;
using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Domain.Entities;

namespace backend.Modules.FleetManagement.Application.Mappers;

public class ExceptionalDriverUsageProfile : Profile
{
    public ExceptionalDriverUsageProfile()
    {
        CreateMap<ExceptionalDriverUsage, ExceptionalDriverResponseDto>();
        CreateMap<ExceptionalDriverUsageRequestDto, ExceptionalDriverUsage>().ForMember(dest => dest.id, opt => opt.Ignore());
    }
}