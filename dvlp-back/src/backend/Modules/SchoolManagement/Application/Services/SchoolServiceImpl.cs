using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.SchoolManagement.Application.Services;

public class SchoolServiceImpl : ACrudService<SchoolEntity, SchoolResponseDto, SchoolRequestDto>
{
    public SchoolServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }
}