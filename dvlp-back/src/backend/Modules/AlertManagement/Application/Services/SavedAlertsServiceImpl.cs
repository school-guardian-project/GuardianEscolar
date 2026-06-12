using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.AlertManagement.Application.DTOs.Request;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Modules.AlertManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.AlertManagement.Application.Services;

public class SavedAlertsServiceImpl : ACrudService<SavedAlert, SavedAlertsResponseDto, SavedAlertsRequestDto>
{
    public SavedAlertsServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}