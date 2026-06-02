namespace backend.Application.DTOs.Auth
{
    public class LoginResponseDto
    {
        public String AccessToken { get; set; }

        public DateTime Expiration { get; set; }

        public String Name { get; set; }

        public String Email { get; set; }

        public List<String> Roles { get; set; } = new();
    }
}
