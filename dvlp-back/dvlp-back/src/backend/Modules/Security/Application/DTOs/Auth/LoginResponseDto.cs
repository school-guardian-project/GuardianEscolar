namespace backend.Modules.Security.Application.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string AccessToken { get; set; }

        public DateTime Expiration { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public List<string> Roles { get; set; } = new();
    }
}
