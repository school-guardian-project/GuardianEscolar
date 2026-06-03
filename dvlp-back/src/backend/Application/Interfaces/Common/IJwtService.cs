using backend.Modules.UserManagement.Domain.Entities;

namespace backend.Application.Interfaces.Common
{
    public interface IJwtService
    {
        String GenerateToken(
            Person person,
            List<String> roles
        );
    }
}
