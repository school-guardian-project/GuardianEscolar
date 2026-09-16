using AutoMapper;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;

namespace backend.Modules.UserManagement.Application.Mappers;

public class IdentificationTypeProfile : Profile
{
    public IdentificationTypeProfile()
    {
        CreateMap<IdentificationType, IdentificationTypeResponseDto>();
    }
}