using AutoMapper;
using backend.Modules.AlertManagement.Application.DTOs.AlertsDto;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Modules.AlertManagement.Domain.Entities;

namespace backend.Modules.AlertManagement.Application.Mappers;

public class AlertProfile : Profile
{
    public AlertProfile()
    {
        CreateMap<Alert, AlertResponseDto>();
        CreateMap<AlertRequestDto, Alert>();
    }   
}