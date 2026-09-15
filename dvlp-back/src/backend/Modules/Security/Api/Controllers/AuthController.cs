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
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Autentica un usuario (admin, padre, conductor, estudiante) y retorna JWT + roles.
    /// Todos los intentos son logueados (INFO/WARN/ERROR) para auditoría.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Login([FromBody] LoginRequestDto request)
    {
        var remoteIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        _logger.LogInformation("[Auth] Intento login Email={Email} IP={IP} Hora={Hora}", request.Email, remoteIp, DateTime.UtcNow);

        if (!ModelState.IsValid)
        {
            _logger.LogWarning("[Auth] Validación fallida Email={Email} Errores={Errores}", request.Email, string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
            return BadRequest(new { message = "Datos de entrada inválidos.", errors = ModelState });
        }

        try
        {
            var response = await _authService.LoginAsync(request);
            _logger.LogInformation("[Auth] Login OK Email={Email} Roles={Roles} IP={IP}", request.Email, string.Join(",", response.Roles), remoteIp);
            return Ok(response);
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning("[Auth] Login FALLIDO Email={Email} IP={IP} Motivo={Motivo}", request.Email, remoteIp, ex.Message);
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Auth] Error inesperado login Email={Email} IP={IP}", request.Email, remoteIp);
            return StatusCode(500, new { message = "Error interno. Intenta más tarde." });
        }
    }
}