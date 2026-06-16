using backend.Modules.Security.Application.DTOs.Auth;

namespace backend.Modules.Security.Domain.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(
            LoginRequestDto request
        );
    }
}
