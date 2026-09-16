using AutoMapper;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Domain.Entities;

namespace backend.Modules.RouteManagement.Application.Mappers;

public class ExceptionalRouteUsageProfile : Profile
{
    public ExceptionalRouteUsageProfile()
    {
        CreateMap<ExceptionalRouteUsage, ExceptionalRouteUsageResponseDto>();
        CreateMap<ExceptionalRouteUsageRequestDto, ExceptionalRouteUsage>().ForMember(dest => dest.id, opt => opt.Ignore());
    }
}