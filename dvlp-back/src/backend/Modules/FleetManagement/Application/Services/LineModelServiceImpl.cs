using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Application.Services;

public class LineModelServiceImpl : ACrudService<LineModel, LIneModelResponseDto, LIneModelRequestDto>
{
    public LineModelServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}