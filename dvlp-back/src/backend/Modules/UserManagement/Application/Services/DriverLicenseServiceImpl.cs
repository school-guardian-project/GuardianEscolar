using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Application.Services;

public class DriverLicenseServiceImpl : ACrudService<DriverLicense, DriverLicenseResponseDto, DriverLicenseRequestDto>
{
    public DriverLicenseServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}