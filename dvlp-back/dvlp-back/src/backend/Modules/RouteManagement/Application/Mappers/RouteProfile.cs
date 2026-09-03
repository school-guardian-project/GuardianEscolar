using AutoMapper;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Domain.Entities;

namespace backend.Modules.RouteManagement.Application.Mappers;

public class RouteProfile : Profile
{
    public RouteProfile()
    {
        CreateMap<RouteEntity, RouteEntityResponseDto>();
        CreateMap<RouteEntityRequestDto, RouteEntity>().ForMember(dest => dest.id, opt => opt.Ignore());
    }
}