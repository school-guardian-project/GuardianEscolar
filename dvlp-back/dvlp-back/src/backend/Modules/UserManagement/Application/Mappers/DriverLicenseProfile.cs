using AutoMapper;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;

namespace backend.Modules.UserManagement.Application.Mappers;

public class DriverLicenseProfile : Profile
{
    public DriverLicenseProfile()
    {
        CreateMap<DriverLicense, DriverLicenseResponseDto>();
        CreateMap<DriverLicenseRequestDto, DriverLicense>().ForMember(dest => dest.id, opt => opt.Ignore());
    }
}