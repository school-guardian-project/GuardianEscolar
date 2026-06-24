using backend.Modules.Security.Application.DTOs.Auth;
using backend.Modules.Security.Domain.Interfaces;
using backend.Shared.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Security.Api.Controllers;

[ApiController]
[Route("api/")]
[Tags("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}