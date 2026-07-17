using backend.Infrastructure.Persistence.Context;
using backend.Modules.Security.Domain.Interfaces;
using Profile = backend.Modules.Security.Domain.Entities.Profile;

namespace backend.Modules.Security.Application.Services;

public class ProfileService
{
    private readonly IPasswordService _passwordService;
    private readonly AppDbContext _context;

    public ProfileService(AppDbContext context, IPasswordService passwordService)
    {
        _passwordService = passwordService;
        _context = context;
    }

    // async -> metodo asincrono, permite usar varios await.
    // Task<> representa una operacion que finalizará en el futuro.
    // async + await, permiten atender varias solicitudes a la vez.
    public Profile Create(Guid personId, string password)
    {
        var profile = new Profile
        {
            personId = personId,
            password = _passwordService.Hash(password),
            status = "active"
        };
        
        _context.Profile.Add(profile);

        return profile;
    }
}