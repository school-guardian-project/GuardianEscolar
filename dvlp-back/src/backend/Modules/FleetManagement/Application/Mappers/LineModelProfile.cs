using AutoMapper;
using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Domain.Entities;

namespace backend.Modules.FleetManagement.Application.Mappers;

public class LineModelProfile : Profile
{
    public LineModelProfile()
    {
        CreateMap<LineModel, LineModelResponseDto>();
        CreateMap<LIneModelRequestDto, LineModel>().ForMember(dest => dest.id, opt => opt.Ignore());
    }
}