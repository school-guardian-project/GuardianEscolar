using backend.Infrastructure.Persistence.Context;
using backend.Shared.Exceptions;
using backend.Modules.Security.Application.DTOs.Auth;
using backend.Modules.Security.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Security.Application.Services
{
    public class AuthService : IAuthService
    {
        public readonly AppDbContext _context;

        public readonly IPasswordService _passwordService;

        public readonly IJwtService _jwtService;

        public AuthService(AppDbContext context, IPasswordService passwordService, IJwtService jwtService)
        {
            _context = context;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var person = await _context.Person
                .Include(x => x.profiles)
                    .ThenInclude(x => x.profileRoles)
                    .ThenInclude(x => x.role)
                .FirstOrDefaultAsync(x => x.email == request.Email);
        
            if (person is null)
            {
                throw new UnauthorizedException("Credenciales Invalidas");
            }

            var profile = person.profiles.FirstOrDefault();
            if (profile is null)
            {
                throw new UnauthorizedException("Credenciales Invalidas");
            }

            var passwordCorrect = _passwordService.Verify(profile.password, request.Password);

            if (!passwordCorrect)
            {
                throw new UnauthorizedException("Credenciales Invalidas");
            }

            var roles = person.profiles.SelectMany(p => p.profileRoles).Select(pr => pr.role.name).ToList();

            var token = _jwtService.GenerateToken(person, roles);

            return new LoginResponseDto
            {
                AccessToken = token,
                Expiration = DateTime.UtcNow.AddMinutes(15),
                Name = person.name,
                Email = person.email,
                Roles = roles
            };
        }
    }
}
