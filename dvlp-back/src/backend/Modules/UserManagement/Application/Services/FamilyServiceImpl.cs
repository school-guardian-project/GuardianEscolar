using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Application.Services;

public class FamilyServiceImpl : ACrudService<Family, FamilyResponseDto, FamilyRequestDto>
{
    public FamilyServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}