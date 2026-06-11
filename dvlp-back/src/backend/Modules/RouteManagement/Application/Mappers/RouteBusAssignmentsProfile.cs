using AutoMapper;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Domain.Entities;

namespace backend.Modules.RouteManagement.Application.Mappers;

public class RouteBusAssignmentsProfile : Profile
{
    public RouteBusAssignmentsProfile()
    {
        CreateMap<RouteBusAssignments, RouteBusAssignmentsResponseDto>();
        CreateMap<RouteBusAssignmentsRequestDto, RouteBusAssignments>();
    }
}