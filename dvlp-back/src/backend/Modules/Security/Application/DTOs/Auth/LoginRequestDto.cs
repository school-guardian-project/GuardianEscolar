using System.ComponentModel.DataAnnotations;

namespace backend.Modules.Security.Application.DTOs.Auth
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "El correo es requerido.")]
        [EmailAddress(ErrorMessage = "Formato de correo inválido.")]
        [StringLength(254, ErrorMessage = "El correo no debe exceder 254 caracteres.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida.")]
        [StringLength(128, MinimumLength = 1, ErrorMessage = "La contraseña debe tener entre 1 y 128 caracteres.")]
        public string Password { get; set; } = string.Empty;
    }
}
