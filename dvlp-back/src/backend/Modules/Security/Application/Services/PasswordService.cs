using backend.Modules.Security.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace backend.Modules.Security.Application.Services
{
    public class PasswordService : IPasswordService
    {
        private readonly PasswordHasher<object> _hasher = new();
        
        public string Hash(string password)
        {
            return _hasher.HashPassword(null!, password);
        }

        public bool Verify(string hash, string password)
        {
            var result = _hasher.VerifyHashedPassword(null!, hash, password);

            return result == PasswordVerificationResult.Success;
        }

    }
}
