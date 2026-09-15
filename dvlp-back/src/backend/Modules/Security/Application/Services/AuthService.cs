using backend.Infrastructure.Persistence.Context;
using backend.Shared.Exceptions;
using backend.Modules.Security.Application.DTOs.Auth;
using backend.Modules.Security.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Modules.Security.Application.Services
{
    public class AuthService : IAuthService
    {
        public readonly AppDbContext _context;

        public readonly IPasswordService _passwordService;

        public readonly IJwtService _jwtService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AppDbContext context, IPasswordService passwordService, IJwtService jwtService, ILogger<AuthService> logger)
        {
            _context = context;
            _passwordService = passwordService;
            _jwtService = jwtService;
            _logger = logger;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            _logger.LogInformation("[AuthService] Login request Email={Email}", request.Email);
            var person = await _context.Person
                .Include(x => x.profiles)
                    .ThenInclude(x => x.profileRoles)
                    .ThenInclude(x => x.role)
                .FirstOrDefaultAsync(x => x.email == request.Email);
        
            if (person is null)
            {
                _logger.LogWarning("[AuthService] Email no encontrado {Email}", request.Email);
                throw new UnauthorizedException("Credenciales Invalidas");
            }

            var profile = person.profiles.FirstOrDefault();
            if (profile is null)
            {
                _logger.LogWarning("[AuthService] Sin perfil para Email={Email}", request.Email);
                throw new UnauthorizedException("Credenciales Invalidas");
            }

            var passwordCorrect = _passwordService.Verify(profile.password, request.Password);

            if (!passwordCorrect)
            {
                _logger.LogWarning("[AuthService] Password incorrecto Email={Email}", request.Email);
                throw new UnauthorizedException("Credenciales Invalidas");
            }

            var roles = person.profiles.SelectMany(p => p.profileRoles).Select(pr => pr.role.name).ToList();
            _logger.LogInformation("[AuthService] Credenciales válidas Email={Email} Roles={Roles}", request.Email, string.Join(",", roles));

            var token = _jwtService.GenerateToken(person, roles);
            _logger.LogInformation("[AuthService] Token generado Email={Email} Expira 15min", request.Email);

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
