using backend.Application.DTOs.Auth;
using backend.Application.Interfaces.Common;
using backend.Application.Interfaces.Common.Exceptions;
using backend.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Auth
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

        public async Task<LoginResponseDto> LoginAsync(LoginResponseDto request)
        {
            var person = await _context.Person
                .Include(x => x.Profile)
                .Include(x => x.ProfileRole)
                    .ThenInclude(x => x.Role)
                .FirstOrDefaultAsyn(x => x.Email == request.Email);
        
            if (person is null)
            {
                throw new UnauthorizedException("Credenciales Invalidas");
            }

            if (!person.Active)
            {
                throw new UnauthorizedException("Usuario Inactivo");
            }

            var passwordCorrect = _passwordService.Verify(person.Profile.Password, request.Password);

            if (!passwordCorrect)
            {
                person.Profile.IntentosFallidos++;

                if (person.Profile.IntentosFallidos >= 5)
                {
                    person.Profile.Bloqueado = DateTime.UtcNow.AddMinutes(15);

                    person.Profile.IntentosFallidos = 0;
                }

                await _context.SaveChangesAsync();

                throw new UnauthorizedException("Credenciales Invalidas");
            }

            person.Profile.IntentosFallidos = 0;

            var roles = person.ProfileRole.Select(x => x.Role.Name).ToList();

            var token = _jwtService.GenerateToken(person, roles);

            await _context.SaveChangesAsync();

            return new LoginResponseDto
            {
                AccessToken = token,
                Expiration = DateTime.UtcNow.AddMinutes(15),
                Name = person.Name,
                Email = person.Email,
                Roles = roles
            };
        }
    }
}
