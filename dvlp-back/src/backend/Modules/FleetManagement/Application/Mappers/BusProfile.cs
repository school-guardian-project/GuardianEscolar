using AutoMapper;
using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Domain.Entities;

namespace backend.Modules.FleetManagement.Application.Mappers;

public class BusProfile : Profile
{
    public BusProfile()
    {
        CreateMap<Bus, BusResponseDto>();
        CreateMap<BusRequestDto, Bus>();
    }
}