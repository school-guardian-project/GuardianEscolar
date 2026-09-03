using backend.Modules.UserManagement.Domain.Entities;

namespace backend.Modules.Security.Domain.Interfaces
{
    public interface IJwtService
    {
        String GenerateToken(
            Person person,
            List<String> roles
        );
    }
}
