using AutoMapper;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Modules.AlertManagement.Domain.Entities;

namespace backend.Modules.AlertManagement.Application.Mappers;

public class AlertTypeProfile : Profile
{
    public AlertTypeProfile()
    {
        CreateMap<AlertType, AlertTypeResponseDto>();
    }
}