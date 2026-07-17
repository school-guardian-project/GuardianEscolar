using backend.Infrastructure.Persistence.Context;
using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.Security.Application.Services;

public class ProfileRoleService
{
    private readonly AppDbContext _context;

    public ProfileRoleService(AppDbContext context)
    {
        _context = context;
    }

    public void Assign(Guid profileId, Guid roleId)
    {
        _context.ProfileRole.Add(new ProfileRole
        {
            profileId = profileId,
            roleId = roleId,
            status = "active"
        });
    }
}