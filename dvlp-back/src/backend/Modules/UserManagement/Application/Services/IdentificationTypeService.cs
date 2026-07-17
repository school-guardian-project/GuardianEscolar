using backend.Infrastructure.Persistence.Context;
using backend.Modules.UserManagement.Application.DTOs.Response;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.UserManagement.Application.Services;

public class IdentificationTypeService
{
    private readonly AppDbContext _context;

    public IdentificationTypeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<IdentificationTypeResponseDto>> FindAll()
    {
        return await _context.IdentificationType.Select(i => new IdentificationTypeResponseDto
        {
            id = i.id,
            name = i.name
        }).ToListAsync();
    }
}