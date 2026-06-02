using backend.Application.DTOs;
using backend.Application.DTOs.Auth;

namespace backend.Application.Interfaces.Common
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(
            LoginRequestDto request
        );
    }
}
