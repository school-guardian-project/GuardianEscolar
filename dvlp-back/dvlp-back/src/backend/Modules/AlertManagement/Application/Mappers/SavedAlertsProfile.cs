using AutoMapper;
using backend.Modules.AlertManagement.Application.DTOs.Request;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Modules.AlertManagement.Domain.Entities;

namespace backend.Modules.AlertManagement.Application.Mappers;

public class SavedAlertsProfile : Profile
{
    public SavedAlertsProfile()
    {
        CreateMap<SavedAlert, SavedAlertsResponseDto>();
        CreateMap<SavedAlertsRequestDto, SavedAlert>().ForMember(dest => dest.id, opt => opt.Ignore());
    }
}