using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.AlertManagement.Application.DTOs.AlertsDto;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Modules.AlertManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.AlertManagement.Application.Services;

public class AlertServiceImpl : ACrudService<Alert, AlertResponseDto, AlertRequestDto>
{
    public AlertServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}